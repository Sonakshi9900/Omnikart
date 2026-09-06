const Product = require('../models/Product');
const VendorProfile = require('../models/VendorProfile');

// @desc Get Catalog Products with Faceted Filtering, Pagination, and Search
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.ratingAverage = { $gte: Number(rating) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { ratingAverage: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('vendor', 'storeName logo isApproved')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Single Product Details by ID
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'storeName storeSlug logo description metrics');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Create New Product (Vendor Only)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user._id });
    if (!vendorProfile || !vendorProfile.isApproved) {
      return res.status(403).json({ success: false, message: 'Vendor store must be approved by admin to list products.' });
    }

    const { title, description, category, price, compareAtPrice, stock, images } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await Product.create({
      vendor: vendorProfile._id,
      title,
      slug,
      description,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Update Product (Vendor Only)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const vendorProfile = await VendorProfile.findOne({ user: req.user._id });
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.vendor.toString() !== vendorProfile._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product.' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Add Product Review
// @route POST /api/products/:id/reviews
const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.ratingCount = product.reviews.length;
    product.ratingAverage = Number(
      (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1)
    );

    await product.save();

    res.status(201).json({ success: true, message: 'Review added successfully.', product });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, addProductReview };
