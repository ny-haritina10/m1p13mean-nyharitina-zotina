const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

class SaleService {
  async createSale(sellerId, data) {
    const { products, paymentMethod, paymentStatus, amountPaid, customerInfo, discount, notes } = data;

    console.log('📥 Creating sale:', { sellerId, productsCount: products?.length });

    // Validate products array
    if (!products || products.length === 0) {
      throw new Error('At least one product is required');
    }

    // Build sale products with validation
    const saleProducts = [];
    let productsTotal = 0;
    let isPromotional = false;

    for (const item of products) {
      const product = await Product.findOne({ _id: item.productId, seller: sellerId });
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Validate quantity
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Validate unit price
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new Error('Unit price must be greater than 0');
      }

      // Check if product is promotional
      if (product.isPromotional && product.promotionalPrice) {
        isPromotional = true;
      }

      const subtotal = item.quantity * item.unitPrice;
      productsTotal += subtotal;

      saleProducts.push({
        product: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal
      });
    }

    // Apply discount
    const discountPercent = discount || 0;
    const discountAmount = (productsTotal * discountPercent) / 100;
    const totalAmount = productsTotal - discountAmount;

    // Validate payment
    const finalAmountPaid = amountPaid || totalAmount;
    if (paymentStatus === 'paid' && Math.abs(finalAmountPaid - totalAmount) > 1) {
      throw new Error('Amount paid must equal total amount for paid status');
    }

    // Create sale
    const sale = new Sale({
      seller: sellerId,
      products: saleProducts,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentStatus || 'paid',
      amountPaid: finalAmountPaid,
      customerInfo,
      discount: discountPercent,
      isPromotional,
      notes
    });

    await sale.save();

    // Create stock movements for each product (optional - can be disabled)
    // Uncomment if you want sales to automatically create stock movements
    /*
    for (const item of saleProducts) {
      await StockMovement.create({
        product: item.product,
        seller: sellerId,
        type: 'out',
        quantity: item.quantity,
        reason: 'sale',
        stockAfter: 0,
        notes: `Sale: ${sale._id}`
      });
    }
    */

    console.log('✅ Sale created:', sale._id);

    return sale;
  }

  async getSalesBySeller(sellerId, filters = {}) {
    const query = { seller: sellerId };

    // Date range filter
    if (filters.startDate && filters.endDate) {
      query.saleDate = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    // Payment status filter
    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    // Payment method filter
    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      Sale.find(query)
        .populate('products.product', 'name images')
        .sort({ saleDate: 'desc' })
        .skip(skip)
        .limit(limit),
      Sale.countDocuments(query)
    ]);

    return {
      sales,
      totalSales: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getSaleById(saleId, sellerId) {
    return await Sale.findOne({ _id: saleId, seller: sellerId })
      .populate('products.product', 'name images price');
  }

  async deleteSale(saleId, sellerId) {
    const sale = await Sale.findOneAndDelete({ _id: saleId, seller: sellerId });
    
    if (!sale) {
      throw new Error('Sale not found');
    }

    return sale;
  }

  async getDailyReport(sellerId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      seller: sellerId,
      saleDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    };

    const sales = await Sale.find(query);

    // Calculate totals
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalItems = sales.reduce((sum, sale) => {
      return sum + sale.products.reduce((s, p) => s + p.quantity, 0);
    }, 0);

    // Payment methods breakdown
    const paymentMethods = {};
    sales.forEach(sale => {
      if (!paymentMethods[sale.paymentMethod]) {
        paymentMethods[sale.paymentMethod] = 0;
      }
      paymentMethods[sale.paymentMethod] += sale.totalAmount;
    });

    // Top products
    const productSales = {};
    sales.forEach(sale => {
      sale.products.forEach(p => {
        const productId = p.product.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            productName: '',
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += p.quantity;
        productSales[productId].revenue += p.subtotal;
      });
    });

    // Populate product names
    const productIds = Object.keys(productSales);
    const products = await Product.find({ _id: { $in: productIds } });
    products.forEach(p => {
      if (productSales[p._id.toString()]) {
        productSales[p._id.toString()].productName = p.name;
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      date,
      totalSales,
      totalRevenue,
      totalItems,
      paymentMethods,
      topProducts
    };
  }

  async getRevenueStats(sellerId, startDate, endDate, groupBy = 'day') {
    const query = {
      seller: sellerId,
      saleDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const sales = await Sale.find(query);

    // Calculate totals
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalSales = sales.length;
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Group by period
    const breakdown = {};
    sales.forEach(sale => {
      let period;
      const saleDate = new Date(sale.saleDate);

      if (groupBy === 'day') {
        period = saleDate.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        period = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'year') {
        period = saleDate.getFullYear().toString();
      }

      if (!breakdown[period]) {
        breakdown[period] = {
          period,
          revenue: 0,
          sales: 0
        };
      }

      breakdown[period].revenue += sale.totalAmount;
      breakdown[period].sales += 1;
    });

    return {
      period: { start: startDate, end: endDate },
      totalRevenue,
      totalSales,
      averageSale,
      breakdown: Object.values(breakdown).sort((a, b) => a.period.localeCompare(b.period))
    };
  }

  async getTopProducts(sellerId, limit = 10) {
    const sales = await Sale.find({ seller: sellerId })
      .populate('products.product', 'name category');

    const productStats = {};

    sales.forEach(sale => {
      sale.products.forEach(p => {
        const productId = p.product._id.toString();
        
        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            productName: p.product.name,
            category: p.product.category,
            quantitySold: 0,
            revenue: 0,
            transactions: 0
          };
        }

        productStats[productId].quantitySold += p.quantity;
        productStats[productId].revenue += p.subtotal;
        productStats[productId].transactions += 1;
      });
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }
}

module.exports = new SaleService();
