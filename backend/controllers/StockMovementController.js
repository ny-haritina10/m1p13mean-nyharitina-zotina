const stockMovementService = require('../services/StockMovementService');

exports.createMovement = async (req, res, next) => {
  try {
    const { productId, type, quantity, reason, notes } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (!type || !['entry', 'out'].includes(type)) {
      return res.status(400).json({ error: 'Valid type is required (entry or out)' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    if (!reason || !['purchase', 'return', 'adjustment', 'sale', 'damage', 'loss', 'other'].includes(reason)) {
      return res.status(400).json({ error: 'Valid reason is required' });
    }

    const movement = await stockMovementService.createMovement(req.user.userId, {
      productId,
      type,
      quantity,
      reason,
      notes
    });

    res.status(201).json({
      message: 'Stock movement created successfully',
      movement
    });
  } catch (error) {
    if (error.message === 'Product not found or does not belong to seller') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Insufficient stock') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

exports.getMovements = async (req, res, next) => {
  try {
    const { startDate, endDate, type, reason } = req.query;
    const filters = { startDate, endDate, type, reason };

    console.log('📥 Get movements request:', { userId: req.user.userId, filters });

    const movements = await stockMovementService.getMovementsBySeller(req.user.userId, filters);
    console.log('📊 Movements found:', movements.length);
    
    res.json({ movements });
  } catch (error) {
    console.error('❌ Error getting movements:', error);
    next(error);
  }
};

exports.getMovement = async (req, res, next) => {
  try {
    const movement = await stockMovementService.getMovementById(req.params.id, req.user.userId);

    if (!movement) {
      return res.status(404).json({ error: 'Movement not found' });
    }

    res.json(movement);
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const stats = await stockMovementService.getMovementStats(req.user.userId, startDate, endDate);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.getStatsByProduct = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Pass empty strings if not provided - service will handle it
    const stats = await stockMovementService.getMovementStatsByProduct(
      req.user.userId, 
      startDate || '', 
      endDate || ''
    );
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};
