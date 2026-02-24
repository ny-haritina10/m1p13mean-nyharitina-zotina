  # 🎟 TICKET: SELLER-010

# 💰 Gestion des Ventes et Suivi Chiffre d'Affaires – Profil Vendeur

---

## 🎯 Objective

Allow the **Seller (Locataire/Vendeur)** to:

* Record manual sales (for physical payments)
* View sales history
* Track revenue/chiffre d'affaires
* Generate daily reports
* Manage promotional products

This feature provides complete sales tracking and business analytics for sellers.

---

# 📦 Fonctionnalité: Sales Management & Revenue Tracking

```text
Fonctionnalité SELLER-010
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## 📂 New Collection: sales

Represents individual sales transactions.

### Schema

```js
{
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money', 'card', 'mixed'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'paid'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },
  saleDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  isPromotional: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## 📂 Update Collection: products

Add promotional fields:

```js
{
  // ... existing fields
  isPromotional: {
    type: Boolean,
    default: false
  },
  promotionalPrice: {
    type: Number,
    min: 0
  },
  promotionalStartDate: Date,
  promotionalEndDate: Date
}
```

---

## 📌 Indexes

```js
salesSchema.index({ seller: 1, saleDate: -1 });
salesSchema.index({ seller: 1, paymentStatus: 1 });
salesSchema.index({ saleDate: 1 });
```

---

## 📌 Business Rules (DB Level)

* `totalAmount` must equal sum of product subtotals minus discount
* Cannot create sale with non-existent products
* Cannot create sale with quantity > available stock (verified server-side)
* Promotional price must be lower than regular price

---

# 2️⃣ Backend (Node / Express — JavaScript only)

---

## 📁 Models

* `Sale.js` - New model
* Update `Product.js` - Add promotional fields

---

## 📁 Service Layer

### SaleService.js

Responsibilities:

* `createSale(sellerId, saleData)` - Create manual sale
* `getSalesBySeller(sellerId, filters)` - Get sales with filters
* `getSaleById(saleId, sellerId)` - Get single sale
* `getDailyReport(sellerId, date)` - Generate daily report
* `getRevenueStats(sellerId, startDate, endDate)` - Revenue analytics
* `getTopProducts(sellerId, limit)` - Best selling products
* `deleteSale(saleId, sellerId)` - Delete/cancel sale

---

### ProductService.js (Update)

Add methods:

* `setPromotionalPrice(productId, data)` - Set promo price
* `removePromotionalPrice(productId)` - Remove promo
* `getPromotionalProducts(sellerId)` - Get active promotions

---

## 📁 Controller

### SaleController.js

REST endpoints:

```http
POST   /api/seller/sales                    - Create sale
GET    /api/seller/sales                    - Get all sales
GET    /api/seller/sales/:id                - Get single sale
DELETE /api/seller/sales/:id                - Delete sale
GET    /api/seller/sales/report/daily       - Daily report
GET    /api/seller/sales/stats/revenue      - Revenue stats
GET    /api/seller/sales/stats/top-products - Top products
```

### ProductController.js (Update)

Add endpoints:

```http
POST   /api/seller/products/promotion       - Set promotional price
DELETE /api/seller/products/:id/promotion   - Remove promotion
GET    /api/seller/products/promotional     - Get promotional products
```

---

## 📁 Middleware

All routes must use:

* `authMiddleware`
* `roleMiddleware('boutique')`

---

# 3️⃣ API Contract

---

## 📥 Create Sale

**POST** `/api/seller/sales`

**Request:**
```json
{
  "products": [
    {
      "productId": "699df625520eb69adce81c88",
      "quantity": 2,
      "unitPrice": 50000
    }
  ],
  "paymentMethod": "cash",
  "paymentStatus": "paid",
  "amountPaid": 100000,
  "customerInfo": {
    "name": "Jean Dupont",
    "phone": "+261 34 00 000 00"
  },
  "discount": 10,
  "notes": "Vente comptoir"
}
```

**Validation:**
* At least 1 product required
* Quantity must be > 0
* unitPrice must be > 0
* paymentMethod required
* amountPaid must match totalAmount for "paid" status

---

## 📤 Success Response

```json
{
  "message": "Sale created successfully",
  "sale": {
    "_id": "...",
    "totalAmount": 90000,
    "products": [...],
    "saleDate": "2026-02-24T..."
  }
}
```

---

## 📥 Get Sales

**GET** `/api/seller/sales`

**Query Params:**
```
?startDate=2026-02-01
&endDate=2026-02-24
&paymentStatus=paid
?page=1
&limit=20
```

**Response:**
```json
{
  "sales": [...],
  "totalSales": 150,
  "totalRevenue": 15000000,
  "page": 1,
  "limit": 20
}
```

---

## 📥 Daily Report

**GET** `/api/seller/sales/report/daily?date=2026-02-24`

**Response:**
```json
{
  "date": "2026-02-24",
  "totalSales": 25,
  "totalRevenue": 1250000,
  "totalItems": 45,
  "paymentMethods": {
    "cash": 800000,
    "mobile_money": 450000
  },
  "topProducts": [
    {
      "product": "Chemise Homme",
      "quantity": 10,
      "revenue": 500000
    }
  ]
}
```

---

## 📥 Revenue Stats

**GET** `/api/seller/sales/stats/revenue`

**Query Params:**
```
?startDate=2026-01-01
&endDate=2026-02-24
&groupBy=month
```

**Response:**
```json
{
  "period": {
    "start": "2026-01-01",
    "end": "2026-02-24"
  },
  "totalRevenue": 25000000,
  "totalSales": 450,
  "averageSale": 55555,
  "breakdown": [
    {
      "period": "2026-01",
      "revenue": 12000000,
      "sales": 220
    },
    {
      "period": "2026-02",
      "revenue": 13000000,
      "sales": 230
    }
  ]
}
```

---

## 📥 Set Promotional Price

**POST** `/api/seller/products/promotion`

**Request:**
```json
{
  "productId": "699df625520eb69adce81c88",
  "promotionalPrice": 40000,
  "startDate": "2026-02-24",
  "endDate": "2026-03-24"
}
```

**Validation:**
* promotionalPrice < regular price
* endDate > startDate
* Product belongs to seller

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module Structure

```text
src/app/seller/
├── components/
│   ├── sales/
│   │   ├── sale-list/
│   │   ├── sale-form/
│   │   ├── sale-detail/
│   │   └── daily-report/
│   ├── revenue/
│   │   ├── revenue-dashboard/
│   │   └── revenue-chart/
│   └── promotions/
│       ├── promotion-list/
│       └── promotion-form/
└── services/
    ├── sale.service.ts
    └── revenue.service.ts
```

---

## 📁 Components

### SaleListComponent

* Table with columns:
  * Date
  * Products count
  * Total Amount
  * Payment Method
  * Payment Status
  * Actions (View, Delete)
* Filters:
  * Date range
  * Payment status
  * Payment method
* Export to PDF/CSV (future)

### SaleFormComponent

* Product selection (searchable dropdown)
* Quantity input
* Unit price (auto-filled, editable)
* Add multiple products
* Discount percentage
* Payment method selector
* Customer info (optional)
* Notes

### SaleDetailComponent

* Full sale information
* Product list with quantities
* Payment details
* Print receipt option

### DailyReportComponent

* Date selector
* Summary cards:
  * Total Sales
  * Total Revenue
  * Total Items Sold
* Payment method breakdown (pie chart)
* Top products list
* Print/Export button

### RevenueDashboardComponent

* Period selector (day/week/month/year)
* KPI Cards:
  * Total Revenue
  * Total Sales
  * Average Sale
  * Growth percentage
* Revenue chart (line/bar)
* Comparison with previous period

### PromotionListComponent

* Table of promotional products
* Columns:
  * Product
  * Regular Price
  * Promotional Price
  * Discount %
  * Start Date
  * End Date
  * Status (Active/Expired)
  * Actions

### PromotionFormComponent

* Product selector
* Regular price (read-only)
* Promotional price input
* Date range picker
* Save/Cancel buttons

---

## 📁 Services

### sale.service.ts

```ts
createSale(data: any)
getSales(filters?: any)
getSale(id: string)
deleteSale(id: string)
getDailyReport(date: string)
getRevenueStats(startDate, endDate, groupBy)
getTopProducts(limit)
```

### revenue.service.ts

```ts
getDashboardStats(period)
getRevenueBreakdown(startDate, endDate)
comparePeriods(currentStart, currentEnd, previousStart, previousEnd)
```

---

## 📁 Routing

```ts
{
  path: 'sales',
  children: [
    { path: '', component: SaleListComponent },
    { path: 'create', component: SaleFormComponent },
    { path: ':id', component: SaleDetailComponent },
    { path: 'report/daily', component: DailyReportComponent }
  ]
},
{
  path: 'revenue',
  component: RevenueDashboardComponent
},
{
  path: 'promotions',
  children: [
    { path: '', component: PromotionListComponent },
    { path: 'create', component: PromotionFormComponent }
  ]
}
```

---

## 📁 Menu Update

Add to seller menu:

```js
{
  label: "Ventes",
  icon: "shopping_cart",
  route: "/seller/sales",
  roles: ["boutique"],
  order: 3
},
{
  label: "Chiffre d'Affaires",
  icon: "trending_up",
  route: "/seller/revenue",
  roles: ["boutique"],
  order: 4
},
{
  label: "Promotions",
  icon: "local_offer",
  route: "/seller/promotions",
  roles: ["boutique"],
  order: 5
}
```

---

# 5️⃣ Business Rules Enforcement

---

## 📌 Stock Validation

* When creating a sale, verify available stock:
  * `availableStock = product.stock + totalEntries - totalOuts`
  * If `quantity > availableStock` → reject sale
* Optional: Auto-decrement stock on sale (configurable)

---

## 📌 Payment Validation

* If `paymentStatus = 'paid'` → `amountPaid` must equal `totalAmount`
* If `paymentStatus = 'partial'` → `amountPaid` must be < `totalAmount`
* If `paymentStatus = 'pending'` → `amountPaid` can be 0

---

## 📌 Promotional Rules

* Promotional price must be at least 10% lower than regular price
* Cannot have overlapping promotional periods for same product
* Expired promotions automatically revert to regular price

---

## 📌 Automatic Logic

* Daily sales aggregation (can be cron job)
* Expired promotions status update
* Low stock alerts based on sales velocity

---

# 6️⃣ Dashboard / System Impact

---

## 📌 Seller Dashboard Updates

Add widgets:

* Today's Sales count
* Today's Revenue
* Month's Revenue
* Top Product of the day
* Pending payments count

---

## 📌 Analytics Impact

* Sales velocity tracking
* Revenue trends
* Seasonal patterns
* Product performance ranking

---

## 📌 Stock Impact

* Sales affect available stock calculation
* Stock movements can be auto-created from sales (optional)

---

# 7️⃣ Acceptance Criteria ✅

✔ Seller can create manual sale with multiple products
✔ Stock availability validated before sale creation
✔ Payment methods tracked (cash, mobile money, card)
✔ Sales history viewable with filters
✔ Daily report generated with breakdown
✔ Revenue stats with period comparison
✔ Top products identified
✔ Promotional products manageable
✔ Promotional prices auto-expire
✔ All routes protected by auth & role guards
✔ Responsive UI for mobile/desktop

---

# 8️⃣ Definition of Done

* Sale model created in MongoDB with proper indexes
* All CRUD endpoints implemented and tested
* Revenue aggregation queries optimized
* Frontend components complete and responsive
* Charts integrated for revenue visualization
* Daily report exportable (PDF/CSV)
* Promotional system fully functional
* Stock validation enforced server-side
* Role-based protection implemented
* Error handling comprehensive
* Logs added for debugging
* No TypeScript in backend
* Clean separation of concerns
* Production-ready code quality

---

# 📊 Performance Considerations

* Use MongoDB aggregation pipeline for revenue stats
* Index on `saleDate` for fast date-range queries
* Pagination for sales list (default limit: 20)
* Cache daily reports for 1 hour (optional enhancement)

---

# 🔒 Security Considerations

* Seller can only access own sales
* Amount validation to prevent fraud
* Audit trail for deleted sales (soft delete recommended)
* Rate limiting on sale creation (prevent spam)

---

# 🚀 Future Enhancements

* Barcode scanner integration
* Receipt printing with thermal printer support
* Customer loyalty program
* Inventory auto-reorder based on sales velocity
* Multi-currency support
* Integration with mobile money APIs (MVola, Orange Money, Airtel Money)
