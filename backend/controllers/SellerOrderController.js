const sellerOrderService = require('../services/SellerOrderService');
const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: req.query.page,
      limit: req.query.limit
    };

    console.log('📥 Get orders request:', { userId: req.user.userId, filters });

    const result = await sellerOrderService.getOrdersBySeller(req.user.userId, filters);

    console.log('📊 Orders found:', result.totalOrders);

    res.json(result);
  } catch (error) {
    console.error('❌ Get orders error:', error);
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await sellerOrderService.getOrderById(req.params.id, req.user.userId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.validateOrder = async (req, res, next) => {
  try {
    console.log('📥 Validate order request:', {
      userId: req.user.userId,
      orderId: req.params.id,
      notes: req.body.notes
    });

    const order = await sellerOrderService.validateOrder(
      req.params.id,
      req.user.userId,
      req.body.notes
    );

    console.log('✅ Order validated:', order._id);

    res.json({
      message: 'Order validated successfully',
      order
    });
  } catch (error) {
    console.error('❌ Validate order error:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('pending')) {
      return res.status(400).json({ error: error.message });
    }
    
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason, notes } = req.body;

    console.log('📥 Cancel order request:', {
      userId: req.user.userId,
      orderId: req.params.id,
      reason
    });

    if (!reason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }

    const order = await sellerOrderService.cancelOrder(
      req.params.id,
      req.user.userId,
      reason,
      notes
    );

    console.log('✅ Order cancelled:', order._id);

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Cannot cancel')) {
      return res.status(400).json({ error: error.message });
    }
    
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    console.log('📥 Update order status request:', {
      userId: req.user.userId,
      orderId: req.params.id,
      status,
      notes
    });

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await sellerOrderService.updateOrderStatus(
      req.params.id,
      req.user.userId,
      status,
      notes
    );

    // If order is delivered, create a sale automatically
    if (status === 'delivered') {
      console.log('📦 Order delivered, creating sale...');
      
      const Sale = require('../models/Sale');
      const sale = new Sale({
        seller: order.seller,
        products: order.products.map(p => ({
          product: p.product,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          subtotal: p.subtotal
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: 'paid', // Force paid status for delivered orders
        amountPaid: order.totalAmount, // Full amount paid
        customerInfo: {
          name: order.customer?.name,
          phone: order.customer?.phone
        },
        notes: `Commande ${order.orderNumber} - ${notes || 'Livraison confirmée'}`,
        saleDate: new Date()
      });

      await sale.save();
      console.log('✅ Sale created for delivered order:', sale._id);
    }

    console.log('✅ Order status updated:', order._id);

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('❌ Update status error:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Cannot transition')) {
      return res.status(400).json({ error: error.message });
    }
    
    next(error);
  }
};

exports.addInternalNote = async (req, res, next) => {
  try {
    const { notes } = req.body;

    console.log('📥 Add internal note request:', {
      userId: req.user.userId,
      orderId: req.params.id
    });

    const order = await sellerOrderService.addInternalNote(
      req.params.id,
      req.user.userId,
      notes
    );

    console.log('✅ Internal note added:', order._id);

    res.json({
      message: 'Internal note added successfully',
      order
    });
  } catch (error) {
    console.error('❌ Add internal note error:', error);
    next(error);
  }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    console.log('📥 Order stats request:', {
      userId: req.user.userId,
      startDate,
      endDate
    });

    const stats = await sellerOrderService.getOrderStats(
      req.user.userId,
      startDate,
      endDate
    );

    res.json(stats);
  } catch (error) {
    console.error('❌ Get order stats error:', error);
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, products, totalAmount, deliveryAddress, paymentMethod, customerNotes } = req.body;

    console.log('📥 Create order request:', {
      sellerId: req.user.userId,
      customer,
      productsCount: products?.length
    });

    // Generate order number
    const orderNumber = await Order.generateOrderNumber();

    // Transform products to items format
    const items = products.map(p => ({
      product: p.product || p.productId,
      seller: req.user.userId,
      nameSnapshot: p.name || 'Product',
      quantity: p.quantity,
      unitPriceSnapshot: p.unitPrice,
      subtotal: p.subtotal
    }));

    // Create order with proper format
    const order = new Order({
      orderNumber,
      customer,
      sellers: [{
        seller: req.user.userId,
        status: 'PENDING',
        subtotal: totalAmount
      }],
      items: items,
      totalAmount,
      globalStatus: 'PENDING',
      paymentMethod,
      paymentStatus: 'pending',
      deliveryAddress,
      customerNotes,
      statusHistory: [{
        status: 'PENDING',
        notes: 'Commande créée'
      }]
    });

    await order.save();

    console.log('✅ Order created:', order._id);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    next(error);
  }
};
