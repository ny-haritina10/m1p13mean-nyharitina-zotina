---

# 🎟 TICKET: SPACE-ADMIN-007

# 📦 Gestion de la Disponibilité des Box

---

## 🎯 Objective

Allow the Admin to:

* View available vs occupied spaces
* Search/filter spaces
* Set maintenance mode
* Automatically sync availability with contracts

---

# 📦 Fonctionnalité: Disponibilité des Espaces

```text
Fonctionnalité SPACE-ADMIN-007
│
├── BDD (Mongo)
├── Backend
├── API Contract
└── Frontend
```

---

# 1️⃣ BDD Rules

`rentalspaces.status` must follow:

* available
* occupied
* maintenance

---

## 📌 Automatic Status Rule

If:

```js
active contract exists for space
```

Then:

```js
status = "occupied"
```

If contract expired or terminated:

```js
status = "available"
```

Manual override only allowed for:

* maintenance

---

# 2️⃣ Backend

---

## 📁 Service: SpaceAvailabilityService.js

Responsibilities:

* getAvailableSpaces()
* getOccupiedSpaces()
* setMaintenance(spaceId)
* removeMaintenance(spaceId)
* syncSpaceStatus()

---

## 📁 Routes

```http
GET /api/admin/spaces/availability
PATCH /api/admin/spaces/:id/maintenance
PATCH /api/admin/spaces/:id/remove-maintenance
```

---

# 3️⃣ API Response Example

```json
{
  "totalSpaces": 100,
  "available": 40,
  "occupied": 55,
  "maintenance": 5
}
```

---

# 4️⃣ Frontend

---

## 📁 Component: SpaceAvailabilityDashboardComponent

Displays:

* Cards:

    * Total Spaces
    * Available
    * Occupied
    * Maintenance

* Table:

| Name | Floor | Type | Status | Actions |

Actions:

* Set maintenance
* Remove maintenance

---

# 5️⃣ Acceptance Criteria ✅

✔ Real-time availability correct
✔ Maintenance mode works
✔ Automatic sync with contract
✔ Dashboard summary visible
✔ No manual override of occupied