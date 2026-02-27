const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');

class CustomerOrderService {
  async getCustomerOrders(customerId, page = 1, limit = 10) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { customer: customerId };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .select('orderNumber totalAmount globalStatus createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query)
    ]);

    const formattedOrders = orders.map(order => ({
      orderId: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      globalStatus: order.globalStatus,
      createdAt: order.createdAt
    }));

    return {
      success: true,
      data: formattedOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  async getOrderDetail(orderId, customerId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      const error = new Error('Invalid order ID');
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      customer: customerId 
    })
      .populate('sellers.seller', 'boutiqueName')
      .populate('items.product', 'name images')
      .lean();

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    const formattedSellers = order.sellers.map(s => ({
      sellerId: s.seller._id,
      boutiqueName: s.seller.boutiqueName,
      status: s.status,
      subtotal: s.subtotal
    }));

    const formattedItems = order.items.map(item => ({
      productId: item.product._id,
      productName: item.nameSnapshot || item.product?.name || 'Unknown Product',
      productImage: item.product?.images?.[0] || null,
      quantity: item.quantity,
      unitPrice: item.unitPriceSnapshot,
      subtotal: item.subtotal
    }));

    return {
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        globalStatus: order.globalStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryAddress: order.deliveryAddress,
        customerNotes: order.customerNotes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        sellers: formattedSellers,
        items: formattedItems
      }
    };
  }

  computeGlobalStatus(order) {
    if (!order.sellers || order.sellers.length === 0) {
      return 'PENDING';
    }

    const statuses = order.sellers.map(s => s.status);
    const hasCancelled = statuses.includes('CANCELLED');
    const allPending = statuses.every(s => s === 'PENDING');
    const allReady = statuses.every(s => s === 'READY');
    const allCompleted = statuses.every(s => s === 'COMPLETED');
    const anyPreparing = statuses.some(s => s === 'PREPARING' || s === 'CONFIRMED');

    if (allCompleted) return 'COMPLETED';
    if (allReady) return 'READY';
    if (anyPreparing) return 'IN_PROGRESS';
    if (hasCancelled && !anyPreparing) return 'CANCELLED';
    if (allPending) return 'PENDING';
    
    return 'IN_PROGRESS';
  }
}

module.exports = new CustomerOrderService();
