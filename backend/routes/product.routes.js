const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.searchProducts);
router.get('/filters', ProductController.getFilterOptions);

module.exports = router;
