const express = require('express');
const router = express.Router();
const RentController = require('../controllers/RentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
  '/rents',
  authMiddleware,
  roleMiddleware('boutique'),
  RentController.getSellerRents
);

module.exports = router;
