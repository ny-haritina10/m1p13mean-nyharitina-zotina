const Category = require('../models/Category');
const Product = require('../models/Product');

class CategoryService {
  async getCategoriesBySeller(sellerId) {
    const categories = await Category.find({ seller: sellerId, isActive: true })
      .sort({ name: 1 });
    return categories;
  }

  async createCategory(sellerId, name) {
    // Check if category already exists for this seller
    const existingCategory = await Category.findOne({
      seller: sellerId,
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
      return existingCategory;
    }

    const category = new Category({
      name,
      seller: sellerId
    });

    await category.save();
    return category;
  }

  async deleteCategory(categoryId, sellerId) {
    const category = await Category.findOne({ _id: categoryId, seller: sellerId });

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
      seller: sellerId,
      category: category.name
    });

    if (productCount > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    await Category.findByIdAndDelete(categoryId);
    return true;
  }

  async updateCategoryCount(sellerId, categoryName, increment = true) {
    await Category.findOneAndUpdate(
      { seller: sellerId, name: categoryName },
      { $inc: { productCount: increment ? 1 : -1 } }
    );
  }
}

module.exports = new CategoryService();
