const express = require('express');
const router = express.Router();
const RentController = require('../controllers/RentController');
const InvoiceController = require('../controllers/InvoiceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

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
