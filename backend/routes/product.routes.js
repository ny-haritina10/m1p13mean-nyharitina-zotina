const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.searchProducts);
router.get('/filters', ProductController.getFilterOptions);
router.get('/:id', ProductController.getProductDetail);

module.exports = router;
