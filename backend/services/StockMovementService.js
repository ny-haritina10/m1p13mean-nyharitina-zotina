const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');

class StockMovementService {
  async createMovement(sellerId, data) {
    const { productId, type, quantity, reason, notes } = data;

    // Get product and verify it belongs to seller
    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      throw new Error('Product not found or does not belong to seller');
    }

    // Validate stock for 'out' movements
    if (type === 'out') {
      // Get current stock with movements
      const stats = await this.getProductStockStats(productId, sellerId);
      const currentStock = product.stock + stats.totalEntries - stats.totalOuts;
      
      if (currentStock - quantity < 0) {
        throw new Error('Insufficient stock');
      }
    }

    // Create movement only (don't update product stock)
    const movement = new StockMovement({
      product: productId,
      seller: sellerId,
      type,
      quantity,
      reason,
      stockAfter: 0, // Will be calculated on read
      notes
    });

    await movement.save();

    return movement;
  }

  async getProductStockStats(productId, sellerId) {
    const movements = await StockMovement.find({ product: productId, seller: sellerId });
    
    const totalEntries = movements
      .filter(m => m.type === 'entry')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const totalOuts = movements
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    return { totalEntries, totalOuts };
  }

  async getMovementsBySeller(sellerId, filters = {}) {
    const query = { seller: sellerId };

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.reason) {
      query.reason = filters.reason;
    }

    const movements = await StockMovement.find(query)
      .populate('product', 'name images')
      .sort({ createdAt: 'desc' });

    return movements;
  }

  async getMovementById(movementId, sellerId) {
    return await StockMovement.findOne({
      _id: movementId,
      seller: sellerId
    }).populate('product', 'name images');
  }

  async getMovementStats(sellerId, startDate, endDate) {
    const query = {
      seller: sellerId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const movements = await StockMovement.find(query);

    const totalEntries = movements
      .filter(m => m.type === 'entry')
      .reduce((sum, m) => sum + m.quantity, 0);

    const totalOuts = movements
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      totalEntries,
      totalOuts,
      totalMovements: movements.length
    };
  }

  async getMovementStatsByProduct(sellerId, startDate, endDate) {
    const query = {
      seller: sellerId
    };
    
    // Only filter by date if both dates are provided and not empty
    if (startDate && endDate && startDate !== '' && endDate !== '') {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const movements = await StockMovement.find(query);
    console.log('📊 Movements found:', movements.length);

    const statsByProduct = {};

    movements.forEach(movement => {
      const productId = movement.product.toString();
      if (!statsByProduct[productId]) {
        statsByProduct[productId] = {
          productId,
          totalEntries: 0,
          totalOuts: 0
        };
      }

      if (movement.type === 'entry') {
        statsByProduct[productId].totalEntries += movement.quantity;
      } else {
        statsByProduct[productId].totalOuts += movement.quantity;
      }
    });

    console.log('📊 Stats by product:', statsByProduct);
    return Object.values(statsByProduct);
  }
}

module.exports = new StockMovementService();
