const CustomerOrderService = require('../services/CustomerOrderService');

const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await CustomerOrderService.getCustomerOrders(customerId, page, limit);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { orderId } = req.params;

    const result = await CustomerOrderService.getOrderDetail(orderId, customerId);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = {
  getCustomerOrders,
  getOrderDetail
};
