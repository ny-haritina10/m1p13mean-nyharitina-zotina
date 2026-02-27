const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/item/:productId', CartController.updateCartItem);
router.delete('/item/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

module.exports = router;
