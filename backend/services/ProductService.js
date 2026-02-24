const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

class ProductService {
  async createProduct(sellerId, data) {
    const { category, ...productData } = data;
    
    console.log('📝 Creating product in DB:', {
      sellerId,
      category,
      ...productData
    });
    
    const product = new Product({
      ...productData,
      category,
      seller: sellerId
    });
    
    await product.save();
    
    console.log('💾 Product saved to DB:', product._id);
    
    // Update category product count
    await Category.findOneAndUpdate(
      { seller: sellerId, name: category },
      { $inc: { productCount: 1 } },
      { upsert: true }
    );
    
    console.log('📊 Category count updated');
    
    return product;
  }

  async getProductsBySeller(sellerId, filters = {}) {
    const query = { seller: sellerId };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ [filters.sortBy || 'createdAt']: filters.order || 'desc' });

    const lowStockCount = await Product.countDocuments({
      seller: sellerId,
      stock: { $lte: DEFAULT_LOW_STOCK_THRESHOLD },
      stock: { $gt: 0 }
    });

    return { products, lowStockCount };
  }

  async getProductById(productId, sellerId) {
    return await Product.findOne({ _id: productId, seller: sellerId });
  }

  async updateProduct(productId, data) {
    const product = await Product.findOne({ _id: productId });
    
    if (!product) {
      return null;
    }
    
    // If category changed, update counts
    if (data.category && data.category !== product.category) {
      await Category.findOneAndUpdate(
        { seller: product.seller, name: product.category },
        { $inc: { productCount: -1 } }
      );
      
      await Category.findOneAndUpdate(
        { seller: product.seller, name: data.category },
        { $inc: { productCount: 1 } },
        { upsert: true }
      );
    }
    
    return await Product.findOneAndUpdate(
      { _id: productId },
      { ...data, updatedAt: Date.now() },
      { new: true }
    );
  }

  async deleteProduct(productId) {
    const product = await Product.findById(productId);
    
    if (product) {
      // Update category product count
      await Category.findOneAndUpdate(
        { seller: product.seller, name: product.category },
        { $inc: { productCount: -1 } }
      );
      
      return await Product.findByIdAndDelete(productId);
    }
    
    return null;
  }

  async getLowStockProducts(sellerId, threshold = 5) {
    return await Product.find({
      seller: sellerId,
      stock: { $lte: threshold },
      stock: { $gt: 0 }
    });
  }

  async getCategories(sellerId) {
    const categories = await Category.find({ seller: sellerId, isActive: true })
      .sort({ name: 1 })
      .select('name productCount');
    return categories.map(cat => ({ name: cat.name, count: cat.productCount }));
  }

  async getDashboardStats(sellerId) {
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const activeProducts = await Product.countDocuments({ seller: sellerId, status: 'active' });
    const outOfStock = await Product.countDocuments({ seller: sellerId, status: 'out_of_stock' });
    const lowStock = await Product.countDocuments({ 
      seller: sellerId, 
      stock: { $lte: DEFAULT_LOW_STOCK_THRESHOLD },
      stock: { $gt: 0 }
    });

    return {
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock
    };
  }
}

module.exports = new ProductService();
