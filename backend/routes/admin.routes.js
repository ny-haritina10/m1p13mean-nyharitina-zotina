const express = require('express');
const router = express.Router();
const AdminSellerController = require('../controllers/AdminSellerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
  '/sellers',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.getAllSellers
);

router.get(
  '/sellers/:id',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.getSellerById
);

router.patch(
  '/sellers/:id/approve',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.approveSeller
);

router.patch(
  '/sellers/:id/reject',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.rejectSeller
);

router.patch(
  '/sellers/:id/suspend',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.suspendSeller
);

router.patch(
  '/sellers/:id/reactivate',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.reactivateSeller
);

module.exports = router;
