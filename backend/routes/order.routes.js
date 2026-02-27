const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const CustomerOrderController = require('../controllers/CustomerOrderController');

router.use(authMiddleware);
router.use(roleMiddleware('customer'));

router.get('/', CustomerOrderController.getCustomerOrders);
router.get('/:orderId', CustomerOrderController.getOrderDetail);

module.exports = router;
