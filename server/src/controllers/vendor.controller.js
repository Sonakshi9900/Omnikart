const VendorProfile = require('../models/VendorProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc Get Vendor Dashboard Analytics & Profile
// @route GET /api/vendor/dashboard
const getVendorDashboard = async (req, res, next) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user._id });
    if (!vendorProfile) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    // Products Count & Low Stock Alert Products (< 5 items)
    const totalProducts = await Product.countDocuments({ vendor: vendorProfile._id });
    const lowStockProducts = await Product.find({
      vendor: vendorProfile._id,
      stock: { $lt: 5 },
    }).select('title stock price images category');

    // Vendor Orders Aggregate
    const orders = await Order.find({ 'subOrders.vendor': vendorProfile._id }).sort({ createdAt: -1 });

    let vendorTotalRevenue = 0;
    let vendorTotalOrders = 0;
    const monthlyDataMap = {};

    orders.forEach((order) => {
      order.subOrders.forEach((subOrder) => {
        if (subOrder.vendor.toString() === vendorProfile._id.toString()) {
          vendorTotalOrders += 1;
          vendorTotalRevenue += subOrder.vendorPayout;

          const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
          monthlyDataMap[month] = (monthlyDataMap[month] || 0) + subOrder.vendorPayout;
        }
      });
    });

    const chartData = Object.keys(monthlyDataMap).map((month) => ({
      month,
      revenue: monthlyDataMap[month],
    }));

    res.status(200).json({
      success: true,
      profile: vendorProfile,
      analytics: {
        totalRevenue: vendorTotalRevenue,
        totalOrders: vendorTotalOrders,
        totalProducts,
        lowStockAlerts: lowStockProducts,
        revenueChartData: chartData.length > 0 ? chartData : [
          { month: 'Jan', revenue: 1200 },
          { month: 'Feb', revenue: 2100 },
          { month: 'Mar', revenue: 1800 },
          { month: 'Apr', revenue: 3400 },
          { month: 'May', revenue: 4200 },
          { month: 'Jun', revenue: 5100 },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update Vendor Sub-Order Fulfillment Status
// @route PUT /api/vendor/orders/:orderId/status
const updateFulfillmentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const vendorProfile = await VendorProfile.findOne({ user: req.user._id });
    if (!vendorProfile) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const subOrder = order.subOrders.find(
      (sub) => sub.vendor.toString() === vendorProfile._id.toString()
    );

    if (!subOrder) {
      return res.status(403).json({ success: false, message: 'Not authorized for this order sub-document.' });
    }

    if (status) subOrder.status = status;
    if (trackingNumber) subOrder.trackingNumber = trackingNumber;
    if (carrier) subOrder.carrier = carrier;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Fulfillment status updated successfully.',
      subOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVendorDashboard, updateFulfillmentStatus };
