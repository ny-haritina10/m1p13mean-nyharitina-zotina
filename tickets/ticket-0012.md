# 🎟 TICKET: SYS-009

# 🔐 Gestion des Menus par Rôle & Dashboard Locataire (Vendeur)

---

## 🎯 Objective

Allow the system to:

* **Manage menu visibility by user role** (Admin vs Locataire/Vendeur)
* **Each role sees only their authorized menus**
* Implement the first Locataire menu: **Gestion Boutique**

---

# 📦 Fonctionnalité: Role-Based Menu System + Gestion Boutique

```text
Fonctionnalité SYS-009
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## 📂 New Collection: menuitems

### Schema

```js
{
  label: String,              // Display name
  icon: String,               // Material icon name
  route: String,              // Angular route
  roles: [String],            // ["admin"] | ["boutique"]
  order: Number,              // Display order
  isActive: Boolean,          // Enable/disable
  createdAt: Date
}
```

---

## 📌 Indexes

```js
menuItemsSchema.index({ roles: 1 });
menuItemsSchema.index({ isActive: 1 });
menuItemsSchema.index({ order: 1 });
```

---

## 📌 Seed Data

### Admin Menus

```js
[
  { label: "Dashboard", icon: "dashboard", route: "/admin/dashboard", roles: ["admin"], order: 1 },
  { label: "Gestion Locataires", icon: "people", route: "/admin/sellers", roles: ["admin"], order: 2 },
  { label: "Contrats", icon: "description", route: "/admin/contracts", roles: ["admin"], order: 3 },
  { label: "Loyers", icon: "payments", route: "/admin/rents", roles: ["admin"], order: 4 },
  { label: "Rapports Financiers", icon: "assessment", route: "/admin/reports", roles: ["admin"], order: 5 },
  { label: "Plan du Centre", icon: "map", route: "/admin/map", roles: ["admin"], order: 6 }
]
```

### Locataire / Vendeur Menus

```js
[
  { label: "Ma Boutique", icon: "storefront", route: "/seller/boutique", roles: ["boutique"], order: 1 }
]
```

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

## 📁 Models

* MenuItem.js
* Boutique.js

---

## 📁 Services

* MenuService.js
  * getMenuByRole(role)
  * getAllMenus()
  * createMenuItem(data)

* BoutiqueService.js
  * createOrUpdateBoutique(sellerId, data)
  * getBoutiqueBySeller(sellerId)

---

## 📁 Controllers

* MenuController.js
  * getMenu(req, res)
  * getAllMenus(req, res)
  * createMenuItem(req, res)

* BoutiqueController.js
  * getBoutique(req, res)
  * createOrUpdateBoutique(req, res)

---

## 📁 Routes

```http
GET    /api/menu              (auth)
GET    /api/admin/menus       (admin only)
POST   /api/admin/menus       (admin only)

GET    /api/seller/boutique   (boutique only)
POST   /api/seller/boutique   (boutique only)
```

---

# 3️⃣ API Contract

---

## 📥 GET /api/menu

**Response:**
```json
{
  "menu": [
    {
      "id": "...",
      "label": "Ma Boutique",
      "icon": "storefront",
      "route": "/seller/boutique",
      "order": 1
    }
  ]
}
```

---

## 📥 POST /api/seller/boutique

**Request:**
```json
{
  "name": "Mode & Style",
  "description": "Boutique de vêtements",
  "phone": "+261 34 00 000 00",
  "email": "boutique@example.com",
  "location": {
    "floor": 1,
    "zone": "A",
    "spaceNumber": "A12"
  },
  "openingHours": {
    "monday": { "open": "09:00", "close": "18:00" },
    ...
  }
}
```

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module Structure

```text
src/app/
├── seller/
│   ├── components/
│   │   ├── seller-dashboard/
│   │   └── boutique-form/
│   └── services/
│       └── boutique.service.ts
└── admin/ (existing)
```

---

## 📁 Components

### Seller

* SellerDashboardComponent
* BoutiqueFormComponent

---

## 📁 Services

* boutique.service.ts
  * getBoutique()
  * saveBoutique(data)

---

## 📁 Routing

```ts
{ 
  path: 'seller', 
  loadChildren: () => import('./seller/seller.routes'),
  canActivate: [AuthGuard, SellerGuard]
}
```

---

# 5️⃣ Business Rules Enforcement

---

## 📌 Menu Access Control

* Menu items filtered server-side by role
* Guards prevent direct navigation

---

## 📌 Boutique Restrictions

* Each seller can only manage their own boutique
* Boutique linked to seller via ObjectId

---

# 6️⃣ Dashboard / System Impact

---

## 📌 Admin Dashboard

* Cannot see seller-specific menus

---

## 📌 Seller Dashboard

* Sees only seller menus
* Access to boutique management

---

# 7️⃣ Acceptance Criteria ✅

✔ Menu loaded dynamically based on role
✔ Admin sees only admin menus
✔ Seller sees only seller menus
✔ Role guards protect routes
✔ Seller can create/update boutique
✔ Boutique form with all fields

---

# 8️⃣ Definition of Done

* MenuItem model created in MongoDB
* Seeder populates default menus
* Backend menu API complete
* Seller dashboard created
* Boutique form functional
* No TypeScript in backend
* Clean separation of concerns
