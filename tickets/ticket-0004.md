# 🎟 TICKET: FIN-ADMIN-004

# 💰 Gestion des Loyers (Montant, Échéance, Pénalité de Retard)

---

## 🎯 Objective

Allow the **Responsable Centre Commercial (Admin)** to:

* Define and manage monthly rent payments
* Track payment status
* Manage due dates (échéance)
* Automatically calculate late penalties
* Monitor unpaid / late rents
* View payment history per seller
* Impact contract status if unpaid

This ticket extends the **Contract Management system**.

---

# 📦 Fonctionnalité: Gestion des Loyers

```text
Fonctionnalité FIN-ADMIN-004
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## 📂 New Collection: rentpayments

Represents monthly rent obligations per contract.

---

### 📌 Schema

```js
{
  contract: ObjectId(Contract),
  seller: ObjectId(User),
  month: Number,              // 1 - 12
  year: Number,
  amount: Number,             // base rent
  penaltyAmount: Number,      // calculated penalty
  totalAmount: Number,        // amount + penalty
  dueDate: Date,
  paidAt: Date,
  status: String,             // "pending" | "paid" | "late"
  createdAt: Date
}
```

---

## 📌 Indexes

```js
rentPaymentSchema.index({ contract: 1, month: 1, year: 1 }, { unique: true });
rentPaymentSchema.index({ status: 1 });
rentPaymentSchema.index({ dueDate: 1 });
```

---

## 📌 Business Rules (Database Level)

* Only one rent record per contract per month
* Rent automatically generated each month (manual or automatic)
* Cannot create rent for inactive contract

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

## 📁 Model

* RentPaymentModel.js

---

## 📁 Service Layer

### RentService.js

Responsibilities:

* generateMonthlyRent(contractId, month, year)
* getRents(filter)
* markAsPaid(paymentId)
* calculatePenalty(payment)
* checkLatePayments()
* getSellerRentHistory(sellerId)

---

## 📌 Penalty Calculation Rule

Example rule:

```js
Penalty = 5% of base rent after due date
+ 1% per additional day late (optional enhancement)
```

Example logic:

```js
if (today > dueDate && status === "pending") {
   status = "late";
   penaltyAmount = calculatePenalty();
   totalAmount = amount + penaltyAmount;
}
```

Penalty rules must be configurable (future improvement).

---

## 📁 Controller

### RentController.js

---

## 📌 Admin Routes

```http
POST   /api/admin/rents/generate
GET    /api/admin/rents
GET    /api/admin/rents/:id
PATCH  /api/admin/rents/:id/pay
```

---

## 📌 Seller Routes

```http
GET    /api/seller/rents
```

Seller can only view their rents.

---

## 📁 Middleware

Admin routes:

* authMiddleware
* roleMiddleware("admin")

Seller routes:

* authMiddleware
* roleMiddleware("boutique")

---

# 3️⃣ API Contract

---

## 📥 Generate Monthly Rent

POST `/api/admin/rents/generate`

```json
{
  "contractId": "string",
  "month": 1,
  "year": 2026
}
```

Validation:

* Contract must be active
* Month valid (1–12)
* Rent not already generated

---

## 📤 Rent Object Example

```json
{
  "id": "...",
  "seller": "...",
  "month": 1,
  "year": 2026,
  "amount": 500000,
  "penaltyAmount": 25000,
  "totalAmount": 525000,
  "status": "late",
  "dueDate": "2026-01-05"
}
```

---

## 📥 Mark as Paid

PATCH `/api/admin/rents/:id/pay`

Effects:

* status → paid
* paidAt → now
* freeze penalty

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module

```text
admin/
  rents/
```

---

## 📁 Components

---

### 1️⃣ RentListComponent (Admin)

Table:

| Seller | Month | Year | Amount | Penalty | Total | Status | Action |

Filters:

* Status (pending / late / paid)
* Month
* Year

Actions:

* Mark as Paid
* View Details

---

---

### 2️⃣ GenerateRentComponent

Form:

* Select Contract
* Select Month
* Select Year
* Generate button

---

---

### 3️⃣ SellerRentHistoryComponent

For seller dashboard:

| Month | Year | Total | Status |

Status badges:

* Pending → Orange
* Late → Red
* Paid → Green

---

# 5️⃣ Business Enforcement

---

## 📌 Seller Restrictions

If seller has:

```js
3 consecutive unpaid months
```

Then:

* Automatically suspend contract
  OR
* Block seller dashboard

Rule configurable.

---

## 📌 Contract Impact

If contract status != active:

* Cannot generate rent

If multiple unpaid:

* Admin notified (future ticket)

---

# 6️⃣ Automatic Late Detection

On:

* Login
* Or daily server check

System runs:

```js
checkLatePayments()
```

Which:

* Updates status
* Calculates penalty

---

# 7️⃣ Dashboard Impact

Admin dashboard now displays:

* Total monthly revenue expected
* Total revenue collected
* Total unpaid amount
* Late payments count
* Financial health indicators

---

# 8️⃣ Acceptance Criteria ✅

✔ Admin can generate monthly rent
✔ Cannot duplicate monthly rent
✔ Late payment automatically flagged
✔ Penalty calculated correctly
✔ Admin can mark rent as paid
✔ Seller can view own rent history
✔ Role-based protection enforced
✔ Clean API structure

---

# 9️⃣ Definition of Done

* Mongo indexes created
* Penalty logic implemented
* Status transitions validated
* Admin UI working
* Seller UI working
* Guards enforced
* No TypeScript in backend