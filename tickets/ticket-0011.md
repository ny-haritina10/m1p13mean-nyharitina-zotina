# 🎟 TICKET: SELLER-011

# 📦 Gestion des Commandes – Profil Vendeur

---

## 🎯 Objective

Allow the **Seller (Locataire/Vendeur)** to:

* Receive and view customer orders
* Validate or cancel orders
* Update order status (en préparation, prêt, livré)
* Track order history
* Manage order workflow

This feature completes the sales cycle by connecting customer orders to seller fulfillment.

---

# 📦 Fonctionnalité: Order Management for Sellers

```text
Fonctionnalité SELLER-011
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## 📂 Update Collection: orders

Add seller-specific fields and status tracking.

### Schema Updates

```js
{
  // ... existing fields from customer orders
  
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Seller order management
  orderStatus: {
    type: String,
    enum: ['pending', 'validated', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  validatedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status history for tracking
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  // Seller notes (internal)
  internalNotes: String
}
```

---

## 📌 Indexes

```js
orderSchema.index({ seller: 1, orderStatus: 1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
```

---

## 📌 Business Rules (DB Level)

* Order status must follow valid transitions:
  * `pending` → `validated` or `cancelled`
  * `validated` → `preparing` or `cancelled`
  * `preparing` → `ready`
  * `ready` → `delivered`
* Cannot cancel delivered orders
* Status changes are logged in `statusHistory`

---

# 2️⃣ Backend (Node / Express — JavaScript only)

---

## 📁 Models

* Update `Order.js` - Add seller fields and status tracking

---

## 📁 Service Layer

### SellerOrderService.js

Responsibilities:

* `getOrdersBySeller(sellerId, filters)` - Get seller's orders
* `getOrderById(orderId, sellerId)` - Get single order
* `validateOrder(orderId, sellerId)` - Validate pending order
* `cancelOrder(orderId, sellerId, reason)` - Cancel order
* `updateOrderStatus(orderId, sellerId, newStatus, notes)` - Update status
* `getOrderStats(sellerId, startDate, endDate)` - Order statistics
* `addInternalNote(orderId, sellerId, notes)` - Add seller notes

---

## 📁 Controller

### SellerOrderController.js

REST endpoints:

```http
GET    /api/seller/orders                    - Get all orders
GET    /api/seller/orders/:id                - Get single order
PATCH  /api/seller/orders/:id/validate       - Validate order
PATCH  /api/seller/orders/:id/cancel         - Cancel order
PATCH  /api/seller/orders/:id/status         - Update status
PATCH  /api/seller/orders/:id/notes          - Add internal note
GET    /api/seller/orders/stats/summary      - Order statistics
```

---

## 📁 Middleware

All routes must use:

* `authMiddleware`
* `roleMiddleware('boutique')`

---

# 3️⃣ API Contract

---

## 📥 Get Orders

**GET** `/api/seller/orders`

**Query Params:**
```
?status=pending
&page=1
&limit=20
&startDate=2026-02-01
&endDate=2026-02-24
```

**Response:**
```json
{
  "orders": [
    {
      "_id": "...",
      "orderNumber": "CMD-2026-0001",
      "customer": {
        "name": "Jean Dupont",
        "phone": "+261 34 00 000 00"
      },
      "products": [...],
      "totalAmount": 150000,
      "orderStatus": "pending",
      "createdAt": "2026-02-24T...",
      "statusHistory": [...]
    }
  ],
  "totalOrders": 50,
  "page": 1,
  "limit": 20,
  "statusCounts": {
    "pending": 5,
    "validated": 10,
    "preparing": 3,
    "ready": 2,
    "delivered": 25,
    "cancelled": 5
  }
}
```

---

## 📥 Validate Order

**PATCH** `/api/seller/orders/:id/validate`

**Request:**
```json
{
  "notes": "Commande validée, préparation en cours"
}
```

**Response:**
```json
{
  "message": "Order validated successfully",
  "order": { ... }
}
```

---

## 📥 Cancel Order

**PATCH** `/api/seller/orders/:id/cancel`

**Request:**
```json
{
  "reason": "Rupture de stock",
  "notes": "Produit non disponible"
}
```

**Validation:**
* Reason required for cancellation
* Cannot cancel delivered orders
* Customer will be notified

---

## 📥 Update Order Status

**PATCH** `/api/seller/orders/:id/status`

**Request:**
```json
{
  "status": "preparing",
  "notes": "En cours de préparation"
}
```

**Valid Status Transitions:**
```
pending → validated | cancelled
validated → preparing | cancelled
preparing → ready
ready → delivered
```

---

## 📥 Order Statistics

**GET** `/api/seller/orders/stats/summary`

**Query Params:**
```
?startDate=2026-02-01
&endDate=2026-02-24
```

**Response:**
```json
{
  "period": {
    "start": "2026-02-01",
    "end": "2026-02-24"
  },
  "totalOrders": 150,
  "byStatus": {
    "pending": 5,
    "validated": 10,
    "preparing": 8,
    "ready": 12,
    "delivered": 100,
    "cancelled": 15
  },
  "cancellationRate": 10,
  "averagePreparationTime": 45
}
```

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module Structure

```text
src/app/seller/
├── components/
│   ├── orders/
│   │   ├── order-list/
│   │   ├── order-detail/
│   │   └── order-status-badge/
│   └── order-stats/
│       └── order-stats-dashboard/
└── services/
    └── seller-order.service.ts
```

---

## 📁 Components

### OrderListComponent

* Table with columns:
  * Numéro commande
  * Client
  * Date
  * Produits
  * Montant
  * Statut
  * Actions
* Filters:
  * Status (pending, validated, preparing, ready, delivered, cancelled)
  * Date range
  * Search by order number
* Bulk actions:
  * Validate multiple orders
  * Export to CSV

### OrderDetailComponent

* Full order information
* Customer details
* Product list with quantities
* Order timeline (status history)
* Action buttons based on status:
  * Validate (if pending)
  * Cancel (if pending/validated)
  * Mark as Preparing (if validated)
  * Mark as Ready (if preparing)
  * Mark as Delivered (if ready)
* Internal notes section

### OrderStatusBadgeComponent

* Reusable status badge component
* Color-coded statuses:
  * Pending → Orange
  * Validated → Blue
  * Preparing → Purple
  * Ready → Green
  * Delivered → Green (dark)
  * Cancelled → Red/Gray

### OrderStatsDashboardComponent

* Summary cards:
  * Total Orders
  * Pending Orders
  * Orders to Prepare
  * Ready for Pickup
* Status distribution (pie chart)
* Recent orders list
* Cancellation rate

---

## 📁 Services

### seller-order.service.ts

```ts
getOrders(filters?: any)
getOrder(id: string)
validateOrder(id: string, notes?: string)
cancelOrder(id: string, reason: string, notes?: string)
updateOrderStatus(id: string, status: string, notes?: string)
addInternalNote(id: string, notes: string)
getOrderStats(startDate: string, endDate: string)
```

---

## 📁 Routing

```ts
{
  path: 'orders',
  children: [
    { path: '', component: OrderListComponent },
    { path: ':id', component: OrderDetailComponent }
  ]
},
{
  path: 'orders/stats',
  component: OrderStatsDashboardComponent
}
```

---

## 📁 Menu Update

Add to seller menu:

```js
{
  label: "Commandes",
  icon: "shopping_bag",
  route: "/seller/orders",
  roles: ["boutique"],
  order: 7
}
```

---

# 5️⃣ Business Rules Enforcement

---

## 📌 Status Transition Validation

Server-side validation for status changes:

```js
const VALID_TRANSITIONS = {
  'pending': ['validated', 'cancelled'],
  'validated': ['preparing', 'cancelled'],
  'preparing': ['ready'],
  'ready': ['delivered'],
  'delivered': [],
  'cancelled': []
};

function canTransition(from, to) {
  return VALID_TRANSITIONS[from]?.includes(to) || false;
}
```

---

## 📌 Cancellation Rules

* Seller can cancel if status is `pending` or `validated`
* Cannot cancel `delivered` orders
* Cancellation reason is required
* Customer notification triggered (future enhancement)

---

## 📌 Automatic Actions

* When order is validated → notify customer
* When order is ready → notify customer for pickup
* When order is delivered → archive after 30 days (future)

---

# 6️⃣ Dashboard / System Impact

---

## 📌 Seller Dashboard Updates

Add widgets:

* Pending Orders count (clickable)
* Orders to Prepare count
* Ready Orders count
* Today's Orders

---

## 📌 Notification System (Future)

* Customer notifications on status changes
* Email/SMS notifications
* Push notifications

---

## 📌 Analytics Impact

* Order fulfillment time tracking
* Seller performance metrics
* Cancellation rate monitoring

---

# 7️⃣ Acceptance Criteria ✅

✔ Seller can view all their orders
✔ Seller can filter orders by status
✔ Seller can validate pending orders
✔ Seller can cancel orders with reason
✔ Seller can update order status through workflow
✔ Status history is tracked
✔ Internal notes can be added
✔ Order statistics available
✔ Status badges color-coded
✔ Cannot make invalid status transitions
✔ All routes protected by auth & role guards

---

# 8️⃣ Definition of Done

* Order model updated with seller fields
* All CRUD endpoints implemented
* Status transitions validated server-side
* Frontend components complete
* Order workflow UI functional
* Status history tracking implemented
* Statistics endpoint working
* Role-based protection enforced
* Error handling comprehensive
* Logs added for debugging
* No TypeScript in backend
* Clean separation of concerns
* Production-ready code quality

---

# 📊 Performance Considerations

* Index on `seller` and `orderStatus` for fast queries
* Pagination for order list (default limit: 20)
* Aggregate pipeline for statistics
* Cache order stats for 5 minutes (optional enhancement)

---

# 🔒 Security Considerations

* Seller can only access their own orders
* Status changes logged with user ID
* Cancellation requires reason (audit trail)
* Cannot modify delivered orders
* Rate limiting on status updates (prevent spam)

---

# 🚀 Future Enhancements

* Customer notifications (email/SMS/push)
* Order printing for fulfillment
* Barcode scanning for order pickup
* Delivery tracking integration
* Customer ratings after delivery
* Automated order assignment (for multi-location sellers)
* Order comments/discussion with customer
