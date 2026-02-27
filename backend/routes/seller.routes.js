const express = require('express');
const router = express.Router();
const RentController = require('../controllers/RentController');
const InvoiceController = require('../controllers/InvoiceController');
const BoutiqueController = require('../controllers/BoutiqueController');
const ProductController = require('../controllers/ProductController');
const StockMovementController = require('../controllers/StockMovementController');
const CategoryController = require('../controllers/CategoryController');
const SaleController = require('../controllers/SaleController');
const SellerOrderController = require('../controllers/SellerOrderController');
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
  '/products',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.getAllProducts
);

router.get(
  '/products/low-stock',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.getLowStockAlerts
);

router.get(
  '/products/categories',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.getCategories
);

router.get(
  '/products/stats',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.getDashboardStats
);

// Promotional products routes (MUST be before /products/:id)
router.get(
  '/products/promotional',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.getPromotionalProducts
);

router.post(
  '/products/promotion',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.setPromotionalPrice
);

router.get(
  '/products/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.getProduct
);

router.post(
  '/products',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.createProduct
);

router.patch(
  '/products/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.updateProduct
);

router.delete(
  '/products/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.deleteProduct
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

router.get(
  '/stock/movements',
  authMiddleware,
  roleMiddleware('boutique'),
  StockMovementController.getMovements
);

router.get(
  '/stock/movements/stats',
  authMiddleware,
  roleMiddleware('boutique'),
  StockMovementController.getStats
);

router.get(
  '/stock/movements/stats/by-product',
  authMiddleware,
  roleMiddleware('boutique'),
  StockMovementController.getStatsByProduct
);

router.get(
  '/stock/movements/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  StockMovementController.getMovement
);

router.post(
  '/stock/movements',
  authMiddleware,
  roleMiddleware('boutique'),
  StockMovementController.createMovement
);

router.get(
  '/categories',
  authMiddleware,
  roleMiddleware('boutique'),
  CategoryController.getCategories
);

router.post(
  '/categories',
  authMiddleware,
  roleMiddleware('boutique'),
  CategoryController.createCategory
);

router.delete(
  '/categories/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  CategoryController.deleteCategory
);

// Sales routes
router.post(
  '/sales',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.createSale
);

router.get(
  '/sales',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.getSales
);

router.get(
  '/sales/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.getSale
);

router.delete(
  '/sales/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.deleteSale
);

router.get(
  '/sales/report/daily',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.getDailyReport
);

router.get(
  '/sales/stats/revenue',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.getRevenueStats
);

router.get(
  '/sales/stats/top-products',
  authMiddleware,
  roleMiddleware('boutique'),
  SaleController.getTopProducts
);

// Promotional products routes (DELETE only, others are above)
router.delete(
  '/products/:id/promotion',
  authMiddleware,
  roleMiddleware('boutique'),
  ProductController.removePromotionalPrice
);

// Order routes
router.post(
  '/orders',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.createOrder
);

router.get(
  '/orders',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.getOrders
);

router.get(
  '/orders/:id',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.getOrder
);

router.patch(
  '/orders/:id/validate',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.validateOrder
);

router.patch(
  '/orders/:id/cancel',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.cancelOrder
);

router.patch(
  '/orders/:id/status',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.updateStatus
);

router.patch(
  '/orders/:id/notes',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.addInternalNote
);

router.get(
  '/orders/stats/summary',
  authMiddleware,
  roleMiddleware('boutique'),
  SellerOrderController.getOrderStats
);

module.exports = router;
