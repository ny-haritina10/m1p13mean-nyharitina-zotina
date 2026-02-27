---

# 🎟 TICKET: FO-ORDER-001

# Suivi Commandes – Historique & Statut (Front-Office)

---

## 🎯 Objective

Permettre au **Client connecté** de :

* Consulter son historique de commandes
* Visualiser le statut de chaque commande
* Voir le détail d’une commande multi-boutiques

### Problème résolu

Après commande, le client doit pouvoir suivre ses achats et connaître l’état d’avancement (validation, préparation, prêt, livré, annulé).

### Business Value

* Améliore la confiance utilisateur
* Réduit demandes support
* Structure le cycle post-achat
* Prépare intégration logistique future

### System Impact

* Nouveau module Orders
* Impact sur stock (décrémenté lors confirmation commande)
* Impact dashboards Admin & Seller

---

# 📦 Fonctionnalité: Order Tracking (Front-Office)

```id="x7l2qa"
FO-ORDER-001
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## Collection: orders

```js id="r4m8zt"
{
  customer: ObjectId,  // ref User
  orderNumber: String, // unique human-readable ID
  sellers: [
    {
      seller: ObjectId,
      status: String, // PENDING | CONFIRMED | PREPARING | READY | COMPLETED | CANCELLED
      subtotal: Number
    }
  ],
  items: [
    {
      product: ObjectId,
      seller: ObjectId,
      nameSnapshot: String,
      quantity: Number,
      unitPriceSnapshot: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  globalStatus: String, // derived
  createdAt: Date,
  updatedAt: Date
}
```

---

## Indexes

```js id="p3k9wl"
db.orders.createIndex({ customer: 1 })
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ "sellers.seller": 1 })
```

---

## Business Constraints

* Only authenticated CUSTOMER can have orders
* orderNumber unique
* totalAmount must equal sum(items.subtotal)
* globalStatus derived from seller statuses

---

# 2️⃣ Backend (Node / Express — JavaScript only)

---

## Service Layer

### Core Methods

```js id="j2v8ps"
getCustomerOrders(customerId, page, limit)
getOrderDetail(orderId, customerId)
computeGlobalStatus(order)
```

---

## Business Rules

### Visibility Rule

Customer can only access orders where:

```id="e9m1rx"
order.customer === authenticatedUserId
```

---

### Global Status Logic

| Seller Statuses             | Global Status |
| --------------------------- | ------------- |
| All PENDING                 | PENDING       |
| At least one PREPARING      | IN_PROGRESS   |
| All READY                   | READY         |
| All COMPLETED               | COMPLETED     |
| Any CANCELLED & none active | CANCELLED     |

Computed server-side dynamically.

---

### Order Status Transitions

Valid seller transitions:

```
PENDING → CONFIRMED → PREPARING → READY → COMPLETED
PENDING → CANCELLED
```

Invalid transitions must be rejected.

---

## Endpoints

```id="k5q2nm"
GET /api/orders?page=1&limit=10
GET /api/orders/:orderId
```

---

## Middleware

* JWT Authentication (mandatory)
* Role guard: CUSTOMER only
* ID validation middleware
* Rate limiting

---

# 3️⃣ API Contract

---

## GET /api/orders

### Response

```json id="h8z4ct"
{
  "success": true,
  "data": [
    {
      "orderId": "64abc",
      "orderNumber": "CMD-2026-0001",
      "totalAmount": 450000,
      "globalStatus": "IN_PROGRESS",
      "createdAt": "2026-02-27T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## GET /api/orders/:orderId

```json id="m7p3kv"
{
  "success": true,
  "data": {
    "orderNumber": "CMD-2026-0001",
    "totalAmount": 450000,
    "globalStatus": "IN_PROGRESS",
    "sellers": [
      {
        "sellerId": "98gh",
        "boutiqueName": "Sport Shop",
        "status": "PREPARING",
        "subtotal": 300000
      }
    ],
    "items": [
      {
        "productName": "Nike Air Max",
        "quantity": 2,
        "unitPrice": 150000,
        "subtotal": 300000
      }
    ]
  }
}
```

---

## Validation Rules

* page >= 1
* limit <= 20
* orderId must be valid ObjectId
* Unauthorized access → 403

---

# 4️⃣ Frontend (Angular — Front-Office UX Critical)

---

## Module Structure

```id="c9v2ld"
frontoffice/orders/
  pages/
    order-history/
    order-detail/
  components/
    order-card/
    order-status-badge/
    seller-status-group/
  services/
    order.service.ts
```

---

## Routes

```id="q4n7as"
/orders
/orders/:orderId
```

Protected by:

* AuthGuard (CUSTOMER only)

---

## UI Structure

---

### 🔷 Order History Page

Display list of orders as cards:

Each card contains:

* Order number
* Date
* Total amount
* Global status badge
* “Voir détail” button

Sorted by newest first.

---

### 🔷 Status Badge Colors

| Status      | Color  |
| ----------- | ------ |
| PENDING     | Gray   |
| IN_PROGRESS | Blue   |
| READY       | Orange |
| COMPLETED   | Green  |
| CANCELLED   | Red    |

---

### 🔷 Order Detail Page

Sections:

1. Order summary
2. Seller groups (multi-boutique)
3. Item list
4. Status timeline (optional enhancement)

---

### 🔷 Multi-Boutique Display

Visually separate by boutique:

```
Sport Shop
  - Product A
  - Product B

Tech Store
  - Product C
```

Each group displays seller-specific status.

---

## UX Requirements

* Skeleton loading
* Clear empty state (“Aucune commande”)
* Responsive layout
* Accessible status indicators
* Scroll restoration
* Breadcrumb navigation

---

# 5️⃣ Business Rules Enforcement

* Strict ownership validation
* Global status derived server-side
* No direct status modification from frontend
* Historical orders immutable (read-only)

Optional Future:

* Real-time status update via WebSocket
* Email notifications per status change

---

# 6️⃣ Dashboard Impact

Metrics impacted:

* Orders per day
* Average order value
* Order lifecycle duration
* Seller performance tracking
* Cancellation rate

---

# 7️⃣ Acceptance Criteria ✅

* [ ] Only authenticated customers can access
* [ ] Orders paginated
* [ ] Ownership enforced
* [ ] Global status computed correctly
* [ ] Multi-seller grouping displayed
* [ ] Responsive UI
* [ ] Empty state implemented
* [ ] Proper error handling

---

# 8️⃣ Definition of Done

### Architecture

* Controller thin
* Business logic in Service layer
* Proper Mongo indexes
* Lean queries

### Security

* JWT required
* Role validation
* ID validation
* No data leakage

### Performance

* Pagination enforced
* Indexed queries
* Limited fields projection

### Frontend

* Modular components
* Mobile-first
* No status logic duplication
* Clean separation of concerns
