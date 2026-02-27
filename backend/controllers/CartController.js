const cartService = require('../services/CartService');

const getSessionId = (req) => {
  if (!req.sessionId) {
    req.sessionId = req.headers['x-session-id'] || 
                    req.cookies?.sessionId || 
                    `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return req.sessionId;
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const sessionId = getSessionId(req);

    const result = await cartService.getCart(userId, sessionId);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const userId = req.user?.userId || null;
    const sessionId = getSessionId(req);

    const result = await cartService.addToCart(userId, sessionId, productId, quantity);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const userId = req.user?.userId || null;
    const sessionId = getSessionId(req);

    const result = await cartService.updateCartItem(userId, sessionId, productId, quantity);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const userId = req.user?.userId || null;
    const sessionId = getSessionId(req);

    const result = await cartService.removeFromCart(userId, sessionId, productId);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const sessionId = getSessionId(req);

    const result = await cartService.clearCart(userId, sessionId);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
