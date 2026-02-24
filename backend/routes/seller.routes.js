const express = require('express');
const router = express.Router();
const RentController = require('../controllers/RentController');
const InvoiceController = require('../controllers/InvoiceController');
const BoutiqueController = require('../controllers/BoutiqueController');
const ProductController = require('../controllers/ProductController');
const StockMovementController = require('../controllers/StockMovementController');
const CategoryController = require('../controllers/CategoryController');
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

module.exports = router;
