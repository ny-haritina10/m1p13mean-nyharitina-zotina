const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
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

  async searchProducts({ search, page = 1, limit = 12 }) {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    if (page < 1) page = 1;
    if (limit < 1) limit = 12;
    if (limit > 50) limit = 50;

    const now = new Date();

    const query = {
      status: 'active',
      stock: { $gt: 0 }
    };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    const approvedSellerIds = await User.find({
      role: 'boutique',
      status: 'approved'
    }).select('_id');

    const approvedSellerIdList = approvedSellerIds.map(s => s._id);
    query.seller = { $in: approvedSellerIdList };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .select('name price promotionalPrice isPromotional promotionalStartDate promotionalEndDate images stock status category seller')
        .populate({
          path: 'seller',
          select: 'boutiqueName status'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const data = products.map(product => {
      const isPromotionActive = 
        product.isPromotional &&
        product.promotionalStartDate &&
        product.promotionalEndDate &&
        now >= new Date(product.promotionalStartDate) &&
        now <= new Date(product.promotionalEndDate);

      return {
        id: product._id,
        name: product.name,
        price: product.price,
        promotionalPrice: isPromotionActive ? product.promotionalPrice : null,
        promotionActive: isPromotionActive,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        stock: product.stock,
        category: product.category,
        boutiqueName: product.seller?.boutiqueName
      };
    });

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new ProductService();
