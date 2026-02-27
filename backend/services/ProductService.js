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

  async searchProducts({ search, page = 1, limit = 12, category, boutique, minPrice, maxPrice, promotion, sort }) {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    if (page < 1) page = 1;
    if (limit < 1) limit = 12;
    if (limit > 50) limit = 50;

    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      const error = new Error('minPrice cannot be greater than maxPrice');
      error.statusCode = 400;
      throw error;
    }

    const now = new Date();

    const query = {
      status: 'active',
      stock: { $gt: 0 }
    };

    // Text search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    // Category filter
    if (category && category.trim()) {
      query.category = new RegExp(category.trim(), 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Get approved sellers
    const approvedSellerIds = await User.find({
      role: 'boutique',
      status: 'approved'
    }).select('_id boutiqueName');

    const approvedSellerIdList = approvedSellerIds.map(s => s._id);
    
    // Boutique filter
    if (boutique && boutique.trim()) {
      const boutiqueRegex = new RegExp(boutique.trim(), 'i');
      const filteredSellers = approvedSellerIds.filter(s => 
        s.boutiqueName && boutiqueRegex.test(s.boutiqueName)
      );
      query.seller = { $in: filteredSellers.map(s => s._id) };
    } else {
      query.seller = { $in: approvedSellerIdList };
    }

    // Promotion filter - need to get products and filter manually
    let productsQuery = Product.find(query)
      .select('name price promotionalPrice isPromotional promotionalStartDate promotionalEndDate images stock status category seller')
      .populate({
        path: 'seller',
        select: 'boutiqueName status'
      });

    // Sort
    if (sort) {
      switch (sort) {
        case 'price_asc':
          productsQuery = productsQuery.sort({ price: 1 });
          break;
        case 'price_desc':
          productsQuery = productsQuery.sort({ price: -1 });
          break;
        case 'name_asc':
          productsQuery = productsQuery.sort({ name: 1 });
          break;
        case 'name_desc':
          productsQuery = productsQuery.sort({ name: -1 });
          break;
        case 'newest':
        default:
          productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const skip = (page - 1) * limit;
    productsQuery = productsQuery.skip(skip).limit(limit);

    const [products, total] = await Promise.all([
      productsQuery.lean(),
      Product.countDocuments(query)
    ]);

    // Process products and filter promotions
    let data = products.map(product => {
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

    // Filter for active promotions only if requested
    if (promotion === 'true' || promotion === true) {
      data = data.filter(p => p.promotionActive);
    }

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: data.length,
        pages: Math.ceil(data.length / limit)
      }
    };
  }

  async getFilterOptions() {
    const approvedSellers = await User.find({
      role: 'boutique',
      status: 'approved'
    }).select('boutiqueName');

    const categories = await Product.distinct('category', {
      seller: { $in: approvedSellers.map(s => s._id) },
      status: 'active',
      stock: { $gt: 0 }
    });

    return {
      success: true,
      categories: categories.sort(),
      boutiques: approvedSellers
        .filter(s => s.boutiqueName)
        .map(s => s.boutiqueName)
        .sort()
    };
  }

  async getProductDetail(productId) {
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error('Invalid product ID');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const seller = await User.findById(product.seller).select('boutiqueName status mallLocation').lean();

    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status !== 'approved') {
      const error = new Error('Product not available');
      error.statusCode = 403;
      throw error;
    }

    if (product.status !== 'active') {
      const error = new Error('Product not available');
      error.statusCode = 403;
      throw error;
    }

    const now = new Date();
    const isPromotionActive = 
      product.isPromotional &&
      product.promotionalStartDate &&
      product.promotionalEndDate &&
      now >= new Date(product.promotionalStartDate) &&
      now <= new Date(product.promotionalEndDate);

    return {
      success: true,
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        promotionActive: isPromotionActive,
        promotionalPrice: isPromotionActive ? product.promotionalPrice : null,
        stock: product.stock,
        status: product.status,
        images: product.images || [],
        category: product.category,
        boutique: {
          name: seller.boutiqueName,
          location: {
            zone: seller.mallLocation?.zone || null,
            floor: seller.mallLocation?.floor || null,
            unitNumber: seller.mallLocation?.unitNumber || null
          }
        }
      }
    };
  }
}

module.exports = new ProductService();
