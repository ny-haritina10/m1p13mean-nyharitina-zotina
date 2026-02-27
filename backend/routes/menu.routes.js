const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, MenuController.getMenu);

router.get('/menus', 
  authMiddleware, 
  roleMiddleware('admin'), 
  MenuController.getAllMenus
);

router.post('/menus', 
  authMiddleware, 
  roleMiddleware('admin'), 
  MenuController.createMenuItem
);

router.patch('/menus/:id/toggle', 
  authMiddleware, 
  roleMiddleware('admin'), 
  MenuController.toggleMenuItem
);

module.exports = router;
