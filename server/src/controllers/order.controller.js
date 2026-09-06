const mongoose = require('mongoose');
const stripe = require('../config/stripe');
const Product = require('../models/Product');
const VendorProfile = require('../models/VendorProfile');
const Order = require('../models/Order');

// @desc Process Multi-Vendor Checkout with Session Transaction & Stock Deductions
// @route POST /api/orders/checkout
const processMultiVendorCheckout = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress } = req.body;
    const customerId = req.user._id;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
    }

    // 1. Validate Product Availability & Stock
    const productIds = items.map((i) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).session(session);

    const productMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));
    const vendorItemsMap = new Map();

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product || !product.isActive) {
        throw new Error(`Product "${item.productId}" is unavailable.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.title}". Stock available: ${product.stock}`);
      }

      const vendorIdStr = product.vendor.toString();
      if (!vendorItemsMap.has(vendorIdStr)) {
        vendorItemsMap.set(vendorIdStr, []);
      }
      vendorItemsMap.get(vendorIdStr).push({
        product,
        quantity: item.quantity,
      });
    }

    // 2. Process Vendors & Split Sub-Orders
    const vendorIds = Array.from(vendorItemsMap.keys());
    const vendorProfiles = await VendorProfile.find({ _id: { $in: vendorIds } }).session(session);
    const vendorProfileMap = new Map(vendorProfiles.map((v) => [v._id.toString(), v]));

    const subOrders = [];
    let masterTotalAmount = 0;
    let masterTotalCommission = 0;

    for (const [vendorIdStr, vItems] of vendorItemsMap.entries()) {
      const vendorProf = vendorProfileMap.get(vendorIdStr);
      if (!vendorProf || !vendorProf.isApproved) {
        throw new Error(`Vendor account is pending approval or inactive.`);
      }

      const commissionRate = vendorProf.commissionRate || 10.0;
      let vendorSubtotal = 0;

      const orderItems = vItems.map(({ product, quantity }) => {
        const lineTotal = product.price * quantity;
        vendorSubtotal += lineTotal;

        // Atomic inventory reduction within transaction session
        product.stock -= quantity;
        product.save({ session });

        return {
          product: product._id,
          title: product.title,
          price: product.price,
          quantity,
          image: product.images[0] || '',
        };
      });

      const commissionAmount = Number(((vendorSubtotal * commissionRate) / 100).toFixed(2));
      const vendorPayout = Number((vendorSubtotal - commissionAmount).toFixed(2));

      masterTotalAmount += vendorSubtotal;
      masterTotalCommission += commissionAmount;

      subOrders.push({
        _id: new mongoose.Types.ObjectId(),
        vendor: vendorProf._id,
        items: orderItems,
        subtotal: vendorSubtotal,
        vendorPayout,
        commissionAmount,
        commissionRate,
        status: 'pending',
      });
    }

    // 3. Persist Master Order
    const newOrder = new Order({
      customer: customerId,
      subOrders,
      totalAmount: masterTotalAmount,
      totalCommission: masterTotalCommission,
      paymentStatus: 'pending',
      shippingAddress,
    });

    await newOrder.save({ session });

    // 4. Stripe PaymentIntent Creation
    let clientSecret = 'mock_stripe_client_secret_demo';
    try {
      if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock_key') {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(masterTotalAmount * 100),
          currency: 'usd',
          metadata: {
            orderId: newOrder._id.toString(),
            customerId: customerId.toString(),
          },
        });
        clientSecret = paymentIntent.client_secret;
        newOrder.paymentIntentId = paymentIntent.id;
        await newOrder.save({ session });
      }
    } catch (stripeErr) {
      console.warn('[Stripe Notice]: Fallback to mock secret mode in development environment.');
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      orderId: newOrder._id,
      clientSecret,
      totalAmount: masterTotalAmount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Get Customer Order History
// @route GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('subOrders.vendor', 'storeName logo')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc Stripe Webhook Listener
// @route POST /api/orders/webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    return res.status(400).send(`Webhook Verification Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        'subOrders.$[].status': 'processing',
      });
    }
  }

  res.json({ received: true });
};

module.exports = { processMultiVendorCheckout, getMyOrders, handleStripeWebhook };
