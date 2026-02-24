const saleService = require('../services/SaleService');

exports.createSale = async (req, res, next) => {
  try {
    console.log('📥 Create sale request:', {
      userId: req.user.userId,
      body: req.body
    });

    const { products, paymentMethod, paymentStatus, amountPaid, customerInfo, discount, notes } = req.body;

    // Validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'At least one product is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    const sale = await saleService.createSale(req.user.userId, {
      products,
      paymentMethod,
      paymentStatus,
      amountPaid,
      customerInfo,
      discount,
      notes
    });

    console.log('✅ Sale created successfully:', sale._id);

    res.status(201).json({
      message: 'Sale created successfully',
      sale
    });
  } catch (error) {
    console.error('❌ Create sale error:', error);
    
    if (error.message.includes('Product not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Quantity') || error.message.includes('Price')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('Amount paid') || error.message.includes('Total amount')) {
      return res.status(400).json({ error: error.message });
    }
    
    next(error);
  }
};

exports.getSales = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      paymentStatus: req.query.paymentStatus,
      paymentMethod: req.query.paymentMethod,
      page: req.query.page,
      limit: req.query.limit
    };

    console.log('📥 Get sales request:', { userId: req.user.userId, filters });

    const result = await saleService.getSalesBySeller(req.user.userId, filters);

    console.log('📊 Sales found:', result.totalSales);

    res.json(result);
  } catch (error) {
    console.error('❌ Get sales error:', error);
    next(error);
  }
};

exports.getSale = async (req, res, next) => {
  try {
    const sale = await saleService.getSaleById(req.params.id, req.user.userId);

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    next(error);
  }
};

exports.deleteSale = async (req, res, next) => {
  try {
    await saleService.deleteSale(req.params.id, req.user.userId);
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    if (error.message === 'Sale not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

exports.getDailyReport = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    console.log('📥 Daily report request:', { userId: req.user.userId, date });

    const report = await saleService.getDailyReport(req.user.userId, date);

    res.json(report);
  } catch (error) {
    next(error);
  }
};

exports.getRevenueStats = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    console.log('📥 Revenue stats request:', { userId: req.user.userId, startDate, endDate, groupBy });

    const stats = await saleService.getRevenueStats(
      req.user.userId,
      startDate,
      endDate,
      groupBy || 'day'
    );

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.getTopProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const products = await saleService.getTopProducts(req.user.userId, limit);

    res.json({ products });
  } catch (error) {
    next(error);
  }
};
