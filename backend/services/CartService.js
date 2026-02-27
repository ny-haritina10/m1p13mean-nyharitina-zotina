const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

class CartService {
  async getCart(userId, sessionId) {
    const query = userId 
      ? { user: userId } 
      : { sessionId };

    const cart = await Cart.findOne(query).lean();

    if (!cart) {
      return this.formatEmptyCart();
    }

    return await this.formatCart(cart);
  }

  async addToCart(userId, sessionId, productId, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
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

    if (product.status !== 'active') {
      const error = new Error('Product is not available');
      error.statusCode = 400;
      throw error;
    }

    const seller = await User.findById(product.seller).select('status boutiqueName').lean();
    if (!seller || seller.status !== 'approved') {
      const error = new Error('Seller not available');
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      throw error;
    }

    const now = new Date();
    const isPromotionActive = 
      product.isPromotional &&
      product.promotionalStartDate &&
      product.promotionalEndDate &&
      now >= new Date(product.promotionalStartDate) &&
      now <= new Date(product.promotionalEndDate);

    const priceToUse = isPromotionActive ? product.promotionalPrice : product.price;

    const query = userId 
      ? { user: userId } 
      : { sessionId };

    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        user: userId || null,
        sessionId: sessionId || null,
        items: []
      });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        const error = new Error('Insufficient stock for requested quantity');
        error.statusCode = 400;
        throw error;
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        seller: product.seller,
        quantity,
        priceSnapshot: product.price,
        promotionalPriceSnapshot: isPromotionActive ? product.promotionalPrice : null
      });
    }

    await cart.save();

    return this.getCart(userId, sessionId);
  }

  async updateCartItem(userId, sessionId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error('Invalid product ID');
      error.statusCode = 400;
      throw error;
    }

    if (quantity < 1) {
      return this.removeFromCart(userId, sessionId, productId);
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      throw error;
    }

    const query = userId 
      ? { user: userId } 
      : { sessionId };

    const cart = await Cart.findOne(query);

    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      throw error;
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return this.getCart(userId, sessionId);
  }

  async removeFromCart(userId, sessionId, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error('Invalid product ID');
      error.statusCode = 400;
      throw error;
    }

    const query = userId 
      ? { user: userId } 
      : { sessionId };

    const cart = await Cart.findOne(query);

    if (!cart) {
      return this.formatEmptyCart();
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    return this.getCart(userId, sessionId);
  }

  async clearCart(userId, sessionId) {
    const query = userId 
      ? { user: userId } 
      : { sessionId };

    await Cart.deleteMany(query);

    return this.formatEmptyCart();
  }

  formatEmptyCart() {
    return {
      success: true,
      data: {
        items: [],
        groupedBySeller: [],
        totalQuantity: 0,
        grandTotal: 0
      }
    };
  }

  async formatCart(cart) {
    const productIds = cart.items.map(item => item.product);
    const sellerIds = [...new Set(cart.items.map(item => item.seller))];

    const products = await Product.find({ _id: { $in: productIds } })
      .select('name images stock')
      .lean();

    const sellers = await User.find({ _id: { $in: sellerIds } })
      .select('boutiqueName')
      .lean();

    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    const sellerMap = new Map(sellers.map(s => [s._id.toString(), s]));

    const items = cart.items.map(item => {
      const product = productMap.get(item.product.toString());
      const seller = sellerMap.get(item.seller.toString());
      const unitPrice = item.promotionalPriceSnapshot || item.priceSnapshot;
      const subtotal = unitPrice * item.quantity;

      return {
        productId: item.product,
        name: product?.name || 'Unknown Product',
        image: product?.images?.[0] || null,
        seller: {
          id: item.seller,
          boutiqueName: seller?.boutiqueName || 'Unknown Seller'
        },
        quantity: item.quantity,
        unitPrice,
        subtotal
      };
    });

    const groupedBySeller = [];
    const sellerGroups = new Map();

    items.forEach(item => {
      const sellerId = item.seller.id.toString();
      
      if (!sellerGroups.has(sellerId)) {
        sellerGroups.set(sellerId, {
          sellerId: item.seller.id,
          boutiqueName: item.seller.boutiqueName,
          items: [],
          sellerSubtotal: 0
        });
      }

      const group = sellerGroups.get(sellerId);
      group.items.push(item);
      group.sellerSubtotal += item.subtotal;
    });

    sellerGroups.forEach(group => {
      groupedBySeller.push(group);
    });

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      success: true,
      data: {
        items,
        groupedBySeller,
        totalQuantity,
        grandTotal
      }
    };
  }
}

module.exports = new CartService();
