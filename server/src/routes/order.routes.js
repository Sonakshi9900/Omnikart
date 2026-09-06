const express = require('express');
const { processMultiVendorCheckout, getMyOrders, handleStripeWebhook } = require('../controllers/order.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.post('/checkout', authenticateJWT, processMultiVendorCheckout);
router.get('/my-orders', authenticateJWT, getMyOrders);

module.exports = router;
