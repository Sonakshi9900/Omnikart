const express = require('express');
const { getVendorDashboard, updateFulfillmentStatus } = require('../controllers/vendor.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRoles('vendor', 'admin'));

router.get('/dashboard', getVendorDashboard);
router.put('/orders/:orderId/status', updateFulfillmentStatus);

module.exports = router;
