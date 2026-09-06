const express = require('express');
const {
  getAdminAnalytics,
  updateVendorApproval,
  updateVendorCommission,
  toggleUserStatus,
} = require('../controllers/admin.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRoles('admin'));

router.get('/analytics', getAdminAnalytics);
router.put('/vendors/:vendorId/approval', updateVendorApproval);
router.put('/vendors/:vendorId/commission', updateVendorCommission);
router.put('/users/:userId/toggle-status', toggleUserStatus);

module.exports = router;
