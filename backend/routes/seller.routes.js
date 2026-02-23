const express = require('express');
const router = express.Router();
const RentController = require('../controllers/RentController');
const InvoiceController = require('../controllers/InvoiceController');
const BoutiqueController = require('../controllers/BoutiqueController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
  '/boutique',
  authMiddleware,
  roleMiddleware('boutique'),
  BoutiqueController.getBoutique
);

router.post(
  '/boutique',
  authMiddleware,
  roleMiddleware('boutique'),
  BoutiqueController.createOrUpdateBoutique
);

router.get(
  '/rents',
  authMiddleware,
  roleMiddleware('boutique'),
  RentController.getSellerRents
);

router.get(
  '/invoices/:invoiceId/download',
  authMiddleware,
  roleMiddleware('boutique'),
  InvoiceController.downloadInvoice
);

module.exports = router;
