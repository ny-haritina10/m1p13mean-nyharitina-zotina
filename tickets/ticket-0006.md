# 🎟 TICKET: SPACE-ADMIN-006

# 🗺 Plan Interactif du Centre Commercial

---

## 🎯 Objective

Allow the **Admin (Responsable Centre Commercial)** to:

* Visualize a digital interactive map of the mall
* See each commercial space (box, kiosque, stand)
* View real-time occupancy status
* Click a space to see detailed information
* Filter by floor / type / status

This feature improves operational visibility and occupancy management.

---

# 📦 Fonctionnalité: Plan Interactif

```text
Fonctionnalité SPACE-ADMIN-006
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

We extend `rentalspaces`.

---

## 📂 rentalspaces (Update Schema)

```js
{
  name: String,
  type: "box" | "kiosque" | "stand",
  location: String,
  floor: Number,
  surface: Number,
  monthlyPrice: Number,
  status: "available" | "occupied" | "maintenance",

  // NEW FIELDS
  mapPosition: {
    x: Number,
    y: Number
  },

  width: Number,
  height: Number,

  createdAt: Date
}
```

---

## 📌 Indexes

```js
rentalSpaceSchema.index({ floor: 1 });
rentalSpaceSchema.index({ status: 1 });
rentalSpaceSchema.index({ type: 1 });
```

---

# 2️⃣ Backend

---

## 📁 Service: MallMapService.js

Responsibilities:

* getSpacesByFloor(floor)
* getMapData(floor)
* updateMapPosition(spaceId, coordinates)
* getSpaceDetails(spaceId)

---

## 📁 Controller

### Routes (Admin only)

```http
GET /api/admin/map?floor=1
GET /api/admin/map/space/:id
PATCH /api/admin/map/space/:id/position
```

Protected by:

* authMiddleware
* roleMiddleware("admin")

---

# 3️⃣ API Contract

---

## 📤 GET /api/admin/map?floor=1

Returns:

```json
[
  {
    "id": "...",
    "name": "Box A12",
    "type": "box",
    "status": "occupied",
    "x": 120,
    "y": 340,
    "width": 60,
    "height": 40
  }
]
```

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module

```
admin/mall-map/
```

---

## 📁 Components

### MallMapComponent

Features:

* SVG-based plan
* Each space rendered as rectangle
* Color-coded:

| Status      | Color |
| ----------- | ----- |
| Available   | Green |
| Occupied    | Red   |
| Maintenance | Gray  |

Click behavior:

* Open detail modal

Filters:

* Floor selector
* Type filter
* Status filter

---

# 5️⃣ Business Rules

* Map is read-only except for coordinate editing
* Only admin can edit map layout
* Occupied status automatically derived from active contract

---

# 6️⃣ Acceptance Criteria ✅

✔ Spaces displayed visually
✔ Status color-coded
✔ Floor filtering works
✔ Click shows details
✔ Data fetched dynamically
✔ Role protected