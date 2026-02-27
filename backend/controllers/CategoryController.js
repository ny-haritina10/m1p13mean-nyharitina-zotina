const categoryService = require('../services/CategoryService');
const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ seller: req.user.userId, isActive: true })
      .sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({ error: 'Category name must be at least 3 characters' });
    }

    // Check if category already exists for this seller
    const existingCategory = await Category.findOne({
      seller: req.user.userId,
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({
      name,
      seller: req.user.userId
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, seller: req.user.userId });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({
      seller: req.user.userId,
      category: category.name
    });

    if (productCount > 0) {
      return res.status(400).json({ error: 'Cannot delete category with existing products' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
