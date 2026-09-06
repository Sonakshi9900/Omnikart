const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  addProductReview,
} = require('../controllers/product.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authenticateJWT, authorizeRoles('vendor', 'admin'), createProduct);
router.put('/:id', authenticateJWT, authorizeRoles('vendor', 'admin'), updateProduct);
router.post('/:id/reviews', authenticateJWT, authorizeRoles('customer', 'vendor', 'admin'), addProductReview);

module.exports = router;
