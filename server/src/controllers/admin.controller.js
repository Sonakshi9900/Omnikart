const VendorProfile = require('../models/VendorProfile');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Get System-Wide Command Center Analytics
// @route GET /api/admin/analytics
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await VendorProfile.countDocuments();
    const pendingVendors = await VendorProfile.countDocuments({ isApproved: false });
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find({ paymentStatus: 'paid' });

    let platformGrossRevenue = 0;
    let platformCommissionEarnings = 0;

    orders.forEach((order) => {
      platformGrossRevenue += order.totalAmount;
      platformCommissionEarnings += order.totalCommission;
    });

    const recentVendors = await VendorProfile.find()
      .populate('user', 'name email createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalVendors,
        pendingVendors,
        totalProducts,
        platformGrossRevenue,
        platformCommissionEarnings,
      },
      recentVendors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Approve or Reject Vendor Onboarding Request
// @route PUT /api/admin/vendors/:vendorId/approval
const updateVendorApproval = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { isApproved, commissionRate } = req.body;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    if (typeof isApproved === 'boolean') {
      vendor.isApproved = isApproved;
    }

    if (commissionRate !== undefined && commissionRate !== null) {
      vendor.commissionRate = Number(commissionRate);
    }

    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Vendor '${vendor.storeName}' approval status updated to: ${vendor.isApproved ? 'Approved' : 'Pending/Rejected'}.`,
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update Global or Specific Vendor Commission Rate
// @route PUT /api/admin/vendors/:vendorId/commission
const updateVendorCommission = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { commissionRate } = req.body;

    if (commissionRate === undefined || commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({ success: false, message: 'Commission rate must be between 0 and 100.' });
    }

    const vendor = await VendorProfile.findByIdAndUpdate(
      vendorId,
      { commissionRate: Number(commissionRate) },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Commission rate for '${vendor.storeName}' updated to ${commissionRate}%.`,
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle User Active Status (Flag Account)
// @route PUT /api/admin/users/:userId/toggle-status
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User '${user.name}' account status set to ${user.isActive ? 'Active' : 'Deactivated'}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminAnalytics, updateVendorApproval, updateVendorCommission, toggleUserStatus };
