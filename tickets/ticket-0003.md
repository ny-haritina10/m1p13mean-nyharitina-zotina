# 🎟 TICKET: ADMIN-003

# 📄 Gestion des Contrats de Location (Box, Kiosque, Stand)

---

## 🎯 Objective

Allow the **Super Admin** to:

* Create rental contracts for sellers (locataires)
* Assign a commercial space (box, kiosque, stand)
* Define contract duration and rental amount
* Track contract status (active, expired, terminated)
* Prevent sellers without active contracts from operating

---

# 📦 Fonctionnalité: Gestion des Contrats de Location

```text
Fonctionnalité ADMIN-003
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## 📂 New Collection: rentalspaces

Represents physical commercial spaces inside the mall.

### Schema

```js
{
  name: String,                 // Example: Box A12
  type: String,                 // "box" | "kiosque" | "stand"
  location: String,             // Floor or zone
  surface: Number,              // m²
  monthlyPrice: Number,
  status: String,               // "available" | "occupied" | "maintenance"
  createdAt: Date
}
```

---

## 📂 New Collection: contracts

Represents rental agreement between seller and shopping center.

### Schema

```js
{
  seller: ObjectId(User),       // role = boutique
  rentalSpace: ObjectId(RentalSpace),
  startDate: Date,
  endDate: Date,
  monthlyRent: Number,
  depositAmount: Number,
  status: String,               // "active" | "expired" | "terminated"
  paymentStatus: String,        // "paid" | "unpaid" | "late"
  createdBy: ObjectId(User),    // admin
  createdAt: Date,
  terminatedAt: Date
}
```

---

## 📌 Indexes

```js
contractSchema.index({ seller: 1 });
contractSchema.index({ rentalSpace: 1 });
contractSchema.index({ status: 1 });
```

---

## 📌 Business Rules (DB Level)

* A rental space can only have **one active contract**
* Seller can only have **one active contract**
* When contract becomes active → rentalSpace.status = "occupied"
* When contract ends → rentalSpace.status = "available"

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

## 📁 Models

* RentalSpaceModel.js
* ContractModel.js

---

## 📁 Service Layer

### ContractService.js

Responsibilities:

* createContract()
* getAllContracts(filter)
* getSellerContracts(sellerId)
* terminateContract()
* checkAndExpireContracts() (cron-like logic optional)

---

### RentalSpaceService.js

Responsibilities:

* createSpace()
* updateSpace()
* getAvailableSpaces()
* changeStatus()

---

## 📁 Controller

### ContractController.js

---

### Routes (Admin Only)

```http
POST   /api/admin/contracts
GET    /api/admin/contracts
GET    /api/admin/contracts/:id
PATCH  /api/admin/contracts/:id/terminate
```

---

### Rental Space Routes

```http
POST   /api/admin/spaces
GET    /api/admin/spaces
PATCH  /api/admin/spaces/:id
```

---

## 📁 Middleware

All routes must use:

* authMiddleware
* roleMiddleware("admin")

---

# 3️⃣ API Contract

---

## 📥 Create Contract

POST `/api/admin/contracts`

```json
{
  "sellerId": "string",
  "rentalSpaceId": "string",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": 500000,
  "depositAmount": 1000000
}
```

---

## 📌 Validation Rules

* Seller must exist
* Seller must have role = boutique
* Seller must be approved
* Rental space must be available
* End date must be after start date

---

## 📤 Success Response

```json
{
  "message": "Contract created successfully",
  "contractId": "..."
}
```

---

## 📥 Terminate Contract

PATCH `/api/admin/contracts/:id/terminate`

Effect:

* status = terminated
* rentalSpace.status = available

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module

```text
admin/
  contracts/
  rental-spaces/
```

---

## 📁 Components

### 1️⃣ ContractListComponent

Table:

| Seller | Space | Start | End | Status | Actions |

Actions:

* Terminate
* View

---

### 2️⃣ CreateContractComponent

Form fields:

* Select Seller (dropdown filtered approved sellers)
* Select Available Space
* Start date
* End date
* Monthly rent
* Deposit

---

### 3️⃣ RentalSpaceListComponent

Table:

| Name | Type | Surface | Price | Status |

---

### 4️⃣ CreateRentalSpaceComponent

Form:

* Name
* Type (box / kiosque / stand)
* Location
* Surface
* Monthly price

---

## 📁 Service API

### admin-contract.service.ts

Methods:

```ts
createContract(data)
getContracts()
terminateContract(id)
```

---

### admin-space.service.ts

Methods:

```ts
createSpace(data)
getSpaces()
updateSpace(id, data)
```

---

## 📁 Routing

Protected routes:

```text
/admin/contracts
/admin/contracts/create
/admin/spaces
/admin/spaces/create
```

Guards:

* AuthGuard
* AdminGuard

---

# 5️⃣ Business Enforcement

Seller cannot:

* Access seller dashboard
* Add products
* Operate boutique

If:

```js
No active contract found
```

When seller logs in:

Backend must check:

```js
const activeContract = await Contract.findOne({
  seller: userId,
  status: "active"
});
```

If not found → 403

Message:
"Your rental contract is not active."

---

# 6️⃣ Automatic Expiration (Optional Enhancement)

If:

```js
endDate < today
```

Then:

* status → expired
* rentalSpace.status → available

Can be implemented:

* On login check
* Or with daily cron job

---

# 7️⃣ Acceptance Criteria ✅

✔ Admin can create rental spaces
✔ Admin can create contract
✔ Cannot assign occupied space
✔ Cannot create multiple active contracts for same seller
✔ Seller without active contract cannot operate
✔ Contract termination frees space
✔ Status correctly updated
✔ All routes protected

---

# 8️⃣ Definition of Done

* Clean schema separation
* All validations implemented
* Role-based protection enforced
* No TypeScript in backend
* Angular module structured
* Business rules enforced server-side
