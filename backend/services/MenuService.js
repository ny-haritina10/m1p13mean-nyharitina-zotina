const MenuItem = require('../models/MenuItem');

class MenuService {
  async getMenuByRole(role) {
    const menus = await MenuItem.find({
      roles: role,
      isActive: true
    })
      .sort({ order: 1 })
      .lean();

    return menus.map(menu => ({
      id: menu._id,
      label: menu.label,
      icon: menu.icon,
      route: menu.route,
      order: menu.order
    }));
  }

  async getAllMenus() {
    return await MenuItem.find().sort({ order: 1 });
  }

  async createMenuItem(data) {
    const menuItem = new MenuItem(data);
    await menuItem.save();
    return menuItem;
  }

  async updateMenuItem(id, data) {
    return await MenuItem.findByIdAndUpdate(id, data, { new: true });
  }

  async toggleMenuItem(id) {
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      const error = new Error('Menu item not found');
      error.statusCode = 404;
      throw error;
    }

    menuItem.isActive = !menuItem.isActive;
    await menuItem.save();
    return menuItem;
  }
}

module.exports = new MenuService();
