

# 🎟 TICKET: SPACE-ADMIN-008

# 🔄 Attribution / Réaffectation d’un Box

---

## 🎯 Objective

Allow Admin to:

* Assign a space to a seller
* Reassign a space when contract changes
* Prevent double assignment
* Handle reassignment workflow cleanly

This extends Contract Management.

---

# 📦 Fonctionnalité: Attribution / Réaffectation

```text
Fonctionnalité SPACE-ADMIN-008
│
├── BDD (Mongo)
├── Backend
├── API Contract
└── Frontend
```

---

# 1️⃣ BDD

Uses:

* rentalspaces
* contracts

---

## 📌 New Rule

A seller:

* Can only have ONE active contract

A space:

* Can only have ONE active contract

---

# 2️⃣ Backend

---

## 📁 Service: SpaceAssignmentService.js

Responsibilities:

* assignSpace(sellerId, spaceId, contractData)
* reassignSpace(contractId, newSpaceId)
* validateAvailability()
* closePreviousContractIfNeeded()

---

## 📌 Reassignment Logic

When reassigning:

1. Validate new space available
2. Terminate previous contract
3. Create new contract
4. Update space statuses

---

## 📁 Routes

```http
POST /api/admin/spaces/assign
PATCH /api/admin/spaces/reassign/:contractId
```

---

# 3️⃣ API Example

## Assign

```json
{
  "sellerId": "...",
  "spaceId": "...",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31"
}
```

---

# 4️⃣ Frontend

---

## 📁 Component: AssignSpaceComponent

Form:

* Select Seller
* Select Available Space
* Start Date
* End Date
* Confirm

---

## 📁 Component: ReassignSpaceComponent

* Select New Space
* Confirm reassignment
* Show warning modal

---

# 5️⃣ Business Enforcement

* Cannot assign occupied space
* Cannot reassign to maintenance space
* Contract must be active to reassign
* All operations transactional (ensure consistency)

---

# 6️⃣ Acceptance Criteria ✅

✔ Cannot double assign space
✔ Reassignment terminates previous contract
✔ Status updates correctly
✔ Space availability synchronized
✔ Admin-only access
✔ Clean audit trail
