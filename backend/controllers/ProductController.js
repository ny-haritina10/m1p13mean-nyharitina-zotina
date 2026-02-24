const productService = require('../services/ProductService');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, status, search, sortBy, order } = req.query;
    const filters = { category, status, search, sortBy, order };
    
    const result = await productService.getProductsBySeller(req.user.userId, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id, req.user.userId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, lowStockThreshold, images } = req.body;

    console.log('📥 Create product request:', {
      userId: req.user.userId,
      name,
      category,
      price,
      stock
    });

    // Validation
    if (!name || name.length < 3) {
      console.error('❌ Validation failed: Name too short');
      return res.status(400).json({ error: 'Name must be at least 3 characters' });
    }

    if (!category) {
      console.error('❌ Validation failed: Category required');
      return res.status(400).json({ error: 'Category is required' });
    }

    if (price === undefined || price <= 0) {
      console.error('❌ Validation failed: Invalid price');
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (stock === undefined || stock < 0) {
      console.error('❌ Validation failed: Invalid stock');
      return res.status(400).json({ error: 'Stock must be >= 0' });
    }

    if (images && images.length > 5) {
      console.error('❌ Validation failed: Too many images');
      return res.status(400).json({ error: 'Maximum 5 images allowed' });
    }

    const product = await productService.createProduct(req.user.userId, {
      name,
      description,
      category,
      price,
      stock: stock || 0,
      lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : 5,
      images: images || []
    });

    console.log('✅ Product created:', product._id);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, lowStockThreshold, images } = req.body;

    // Validation
    if (name && name.length < 3) {
      return res.status(400).json({ error: 'Name must be at least 3 characters' });
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: 'Stock must be >= 0' });
    }

    if (images && images.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 images allowed' });
    }

    const product = await productService.updateProduct(req.params.id, {
      name,
      description,
      category,
      price,
      stock,
      lowStockThreshold,
      images
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getLowStockAlerts = async (req, res, next) => {
  try {
    const products = await productService.getLowStockProducts(req.user.userId);
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories(req.user.userId);
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await productService.getDashboardStats(req.user.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
