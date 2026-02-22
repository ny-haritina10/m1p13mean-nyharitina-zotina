Here is the structured ticket following your exact architecture format and MEAN constraints.

---

# 🎟 TICKET: ADMIN-002

# 🏬 Gestion des Locataires (Vendeurs) – Validation des Comptes

---

## 🎯 Objective

Allow the **Super Admin** to:

* View all seller (vendeur) accounts
* Approve or reject seller registrations
* Suspend or reactivate seller accounts
* Filter sellers by status
* Ensure only approved sellers can access their dashboard

---

# 📦 Fonctionnalité: Gestion & Validation des Comptes Vendeurs

```
Fonctionnalité ADMIN-002
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

## 📂 Collection: users

We reuse the existing `users` collection.

---

## 📌 Additional Fields Required

```js
{
  username: String,
  password: String,
  role: "boutique",
  status: "pending" | "approved" | "rejected" | "suspended",
  boutiqueName: String,
  phone: String,
  createdAt: Date,
  approvedAt: Date,
  approvedBy: ObjectId(User)
}
```

---

## 📌 Business Rule

When a seller registers:

```js
role = "boutique"
status = "pending"
```

Seller cannot:

* Access seller dashboard
* Create products
* Manage boutique

Until:

```js
status === "approved"
```

---

## 📌 Index

* Index on role
* Index on status

```js
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
```

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

## 📁 Model

Update `UserModel.js`:

* Add seller fields
* Add status enum
* Default status = pending for boutique role

---

## 📁 Service

### AdminSellerService.js

Responsibilities:

* getAllSellers(filter)
* approveSeller(userId, adminId)
* rejectSeller(userId)
* suspendSeller(userId)
* reactivateSeller(userId)

Business Rules:

* Only users with role "admin" can perform actions
* Cannot approve non-boutique account
* Cannot approve already approved account
* Cannot reactivate rejected account (optional rule)

---

## 📁 Controller

### AdminSellerController.js

---

### 📌 Routes

```http
GET    /api/admin/sellers
PATCH  /api/admin/sellers/:id/approve
PATCH  /api/admin/sellers/:id/reject
PATCH  /api/admin/sellers/:id/suspend
PATCH  /api/admin/sellers/:id/reactivate
```

---

### 📌 Example Approve Response

```json
{
  "message": "Seller approved successfully",
  "seller": {
    "id": "...",
    "username": "vendeur1",
    "status": "approved"
  }
}
```

---

## 📁 Middleware

Must use:

* authMiddleware
* roleMiddleware("admin")

Example:

```js
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  AdminSellerController.approve
);
```

---

# 3️⃣ API Contract

---

## 📥 GET /api/admin/sellers

Query params:

```http
?status=pending
?status=approved
?status=suspended
```

Response:

```json
[
  {
    "id": "...",
    "username": "...",
    "boutiqueName": "...",
    "status": "pending",
    "createdAt": "..."
  }
]
```

---

## 📥 PATCH Approve

No body required.

---

## 📤 Standard Success DTO

```json
{
  "message": "Action completed successfully"
}
```

---

## 📤 Error Cases

* 403 → Not admin
* 404 → Seller not found
* 400 → Invalid status transition

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module

Create:

```
admin/
  seller-management/
```

---

## 📁 Components

### 1️⃣ SellerListComponent

Displays:

* Username
* Boutique name
* Status
* Created date
* Action buttons

Buttons:

* Approve (if pending)
* Reject (if pending)
* Suspend (if approved)
* Reactivate (if suspended)

---

### 2️⃣ SellerDetailComponent (Optional)

Shows full seller information.

---

## 📁 Service API

### admin-seller.service.ts

Methods:

```ts
getSellers(status?: string)
approveSeller(id)
rejectSeller(id)
suspendSeller(id)
reactivateSeller(id)
```

---

## 📁 HTML / UI

Table format:

| Username | Boutique | Status | Actions |
| -------- | -------- | ------ | ------- |

Status badge colors:

* Pending → Orange
* Approved → Green
* Suspended → Red
* Rejected → Gray

---

## 📁 Routing

Protected route:

```
/admin/sellers
```

Must use:

* AuthGuard
* AdminGuard

---

# 5️⃣ Security & Business Enforcement

Backend must enforce:

```js
If role !== "admin" → deny
If seller.status !== "approved"
    → block access to seller protected routes
```

Seller login flow:

After login:

* If status !== approved → return 403 with message:
  "Account awaiting approval"

---

# 6️⃣ Dashboard Impact

Admin Dashboard can now show:

* Total sellers
* Pending sellers
* Approved sellers
* Suspended sellers

---

# 7️⃣ Acceptance Criteria ✅

✔ Seller registers with status pending
✔ Admin can view all sellers
✔ Admin can filter by status
✔ Admin can approve seller
✔ Approved seller can access seller dashboard
✔ Pending seller cannot access seller dashboard
✔ Suspended seller blocked from login
✔ Role-based protection enforced
✔ Clean REST structure respected

---

# 8️⃣ Definition of Done

* Index added in MongoDB
* All routes protected
* Status transitions validated
* No TypeScript in backend
* Angular module separated
* Guards enforced
* Clean code structure