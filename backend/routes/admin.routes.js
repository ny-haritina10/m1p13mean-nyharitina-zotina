const express = require('express');
const router = express.Router();
const AdminSellerController = require('../controllers/AdminSellerController');
const RentalSpaceController = require('../controllers/RentalSpaceController');
const ContractController = require('../controllers/ContractController');
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

router.post(
  '/sellers',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.createSeller
);

router.put(
  '/sellers/:id',
  authMiddleware,
  roleMiddleware('admin'),
  AdminSellerController.updateSeller
);

router.get(
  '/spaces',
  authMiddleware,
  roleMiddleware('admin'),
  RentalSpaceController.getAllSpaces
);

router.get(
  '/spaces/available',
  authMiddleware,
  roleMiddleware('admin'),
  RentalSpaceController.getAvailableSpaces
);

router.get(
  '/spaces/:id',
  authMiddleware,
  roleMiddleware('admin'),
  RentalSpaceController.getSpaceById
);

router.post(
  '/spaces',
  authMiddleware,
  roleMiddleware('admin'),
  RentalSpaceController.createSpace
);

router.patch(
  '/spaces/:id',
  authMiddleware,
  roleMiddleware('admin'),
  RentalSpaceController.updateSpace
);

router.get(
  '/contracts',
  authMiddleware,
  roleMiddleware('admin'),
  ContractController.getAllContracts
);

router.get(
  '/contracts/:id',
  authMiddleware,
  roleMiddleware('admin'),
  ContractController.getContractById
);

router.post(
  '/contracts',
  authMiddleware,
  roleMiddleware('admin'),
  ContractController.createContract
);

router.patch(
  '/contracts/:id/terminate',
  authMiddleware,
  roleMiddleware('admin'),
  ContractController.terminateContract
);

module.exports = router;
