const menuService = require('../services/MenuService');

exports.getMenu = async (req, res, next) => {
  try {
    const { role } = req.user;
    const menu = await menuService.getMenuByRole(role);
    res.json({ menu });
  } catch (error) {
    next(error);
  }
};

exports.getAllMenus = async (req, res, next) => {
  try {
    const menus = await menuService.getAllMenus();
    res.json({ menus });
  } catch (error) {
    next(error);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await menuService.createMenuItem(req.body);
    res.status(201).json({
      message: 'Menu item created',
      menuItem
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleMenuItem = async (req, res, next) => {
  try {
    const menuItem = await menuService.toggleMenuItem(req.params.id);
    res.json({
      message: 'Menu item toggled',
      menuItem
    });
  } catch (error) {
    next(error);
  }
};
