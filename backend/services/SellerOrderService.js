const Order = require('../models/Order');

class SellerOrderService {
  async getOrdersBySeller(sellerId, filters = {}) {
    const query = { seller: sellerId };

    // Status filter
    if (filters.status) {
      query.orderStatus = filters.status;
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    // Get orders and total
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customer', 'name phone email')
        .populate('products.product', 'name images')
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    // Get status counts from all orders (not filtered)
    const allOrders = await Order.find({ seller: sellerId }).select('orderStatus');
    
    // Convert statusCounts array to object
    const statusCountsObj = {
      pending: 0,
      validated: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0
    };
    
    allOrders.forEach(order => {
      if (statusCountsObj.hasOwnProperty(order.orderStatus)) {
        statusCountsObj[order.orderStatus]++;
      }
    });

    console.log('📊 Status counts:', statusCountsObj);

    return {
      orders,
      totalOrders: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      statusCounts: statusCountsObj
    };
  }

  async getOrderById(orderId, sellerId) {
    return await Order.findOne({ 
      _id: orderId, 
      seller: sellerId 
    })
      .populate('customer', 'name phone email')
      .populate('products.product', 'name images price');
  }

  async validateOrder(orderId, sellerId, notes) {
    const order = await Order.findOne({ 
      _id: orderId, 
      seller: sellerId 
    });
    
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.orderStatus !== 'pending') {
      throw new Error('Only pending orders can be validated');
    }

    await order.updateStatus('validated', sellerId, notes);
    return order;
  }

  async cancelOrder(orderId, sellerId, reason, notes) {
    const order = await Order.findOne({ 
      _id: orderId, 
      seller: sellerId 
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      throw new Error(`Cannot cancel order with status: ${order.orderStatus}`);
    }

    order.cancellationReason = reason;
    order.cancelledBy = sellerId;

    await order.updateStatus('cancelled', sellerId, notes);
    return order;
  }

  async updateOrderStatus(orderId, sellerId, newStatus, notes) {
    const order = await Order.findOne({ 
      _id: orderId, 
      seller: sellerId 
    });

    if (!order) {
      throw new Error('Order not found');
    }

    await order.updateStatus(newStatus, sellerId, notes);
    return order;
  }

  async addInternalNote(orderId, sellerId, notes) {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, seller: sellerId },
      { internalNotes: notes },
      { new: true }
    );

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async getOrderStats(sellerId, startDate, endDate) {
    const query = {
      seller: sellerId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const orders = await Order.find(query);

    const byStatus = {};
    let totalPreparationTime = 0;
    let ordersWithPreparation = 0;

    orders.forEach(order => {
      // Count by status
      byStatus[order.orderStatus] = (byStatus[order.orderStatus] || 0) + 1;

      // Calculate preparation time (validated to ready)
      if (order.validatedAt && order.readyAt) {
        const prepTime = (order.readyAt - order.validatedAt) / (1000 * 60); // in minutes
        totalPreparationTime += prepTime;
        ordersWithPreparation++;
      }
    });

    const totalOrders = orders.length;
    const cancellationRate = totalOrders > 0 
      ? Math.round(((byStatus['cancelled'] || 0) / totalOrders) * 100) 
      : 0;

    const averagePreparationTime = ordersWithPreparation > 0
      ? Math.round(totalPreparationTime / ordersWithPreparation)
      : 0;

    return {
      period: { start: startDate, end: endDate },
      totalOrders,
      byStatus,
      cancellationRate,
      averagePreparationTime
    };
  }

  async createOrder(sellerId, orderData) {
    const order = new Order({
      seller: sellerId,
      ...orderData
    });
    
    await order.save();
    return order;
  }
}

module.exports = new SellerOrderService();
