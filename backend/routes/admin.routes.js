const express = require('express');
const router = express.Router();
const AdminSellerController = require('../controllers/AdminSellerController');
const RentalSpaceController = require('../controllers/RentalSpaceController');
const ContractController = require('../controllers/ContractController');
const RentController = require('../controllers/RentController');
const FinancialReportController = require('../controllers/FinancialReportController');
const InvoiceController = require('../controllers/InvoiceController');
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

router.post(
  '/rents/generate',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.generateRent
);

router.get(
  '/rents/stats',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.getDashboardStats
);

router.get(
  '/rents',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.getAllRents
);

router.get(
  '/rents/:id',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.getRentById
);

router.patch(
  '/rents/:id/pay',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.markAsPaid
);

router.post(
  '/rents/check-late',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.checkLatePayments
);

router.get(
  '/rents/stats',
  authMiddleware,
  roleMiddleware('admin'),
  RentController.getDashboardStats
);

router.get(
  '/reports/monthly',
  authMiddleware,
  roleMiddleware('admin'),
  FinancialReportController.getMonthlyReport
);

router.get(
  '/reports/yearly',
  authMiddleware,
  roleMiddleware('admin'),
  FinancialReportController.getYearlyReport
);

router.get(
  '/reports/summary',
  authMiddleware,
  roleMiddleware('admin'),
  FinancialReportController.getRevenueSummary
);

router.get(
  '/reports/unpaid',
  authMiddleware,
  roleMiddleware('admin'),
  FinancialReportController.getUnpaidSummary
);

router.post(
  '/invoices/:rentPaymentId',
  authMiddleware,
  roleMiddleware('admin'),
  InvoiceController.generateInvoice
);

router.get(
  '/invoices/:invoiceId/download',
  authMiddleware,
  roleMiddleware('admin'),
  InvoiceController.downloadInvoice
);

router.get(
  '/invoices/payment/:rentPaymentId',
  authMiddleware,
  roleMiddleware('admin'),
  InvoiceController.getInvoiceByPayment
);

module.exports = router;
