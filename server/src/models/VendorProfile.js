const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      unique: true,
    },
    storeSlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    commissionRate: {
      type: Number,
      default: 10.0, // 10% platform commission default
      min: 0,
      max: 100,
    },
    stripeAccountId: {
      type: String,
      default: '',
    },
    stripeOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    metrics: {
      totalSales: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
