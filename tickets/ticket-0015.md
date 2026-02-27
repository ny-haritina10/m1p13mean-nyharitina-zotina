

# 🎟 TICKET: FO-CUST-003

# Filtres Produits & Promotions

---

## 🎯 Objective

Permettre aux clients de filtrer les produits par :

* Catégorie
* Prix (min/max)
* Boutique
* Promotions actives

### Business Value

* Meilleure expérience utilisateur
* Mise en avant des promotions
* Augmentation panier moyen

---

# 📦 Fonctionnalité: Product Filtering & Promotions

```
FO-CUST-003
│
├── BDD
├── Backend
├── API
└── Frontend
```

---

## 1️⃣ BDD (MongoDB)

Products (fields supplémentaires)

```js
isPromotion: Boolean,
promotionPrice: Number,
promotionStart: Date,
promotionEnd: Date
```

### Indexes

```js
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ boutiqueId: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ isPromotion: 1 })
```

Constraints:

* promotionPrice < price
* Promotion active only within date range

---

## 2️⃣ Backend

### Service

* filterProducts(filters)

Rules:

* Combine filters dynamically
* Validate minPrice <= maxPrice
* Promotion active only if:

    * isPromotion = true
    * currentDate within range

---

### Endpoint

```
GET /api/products?
category=
&boutique=
&minPrice=
&maxPrice=
&promotion=true
&sort=price_asc
```

---

## 3️⃣ API Example

```json
{
  "success": true,
  "data": [
    {
      "name": "Nike Shoes",
      "price": 200000,
      "promotionPrice": 150000,
      "isPromotion": true
    }
  ]
}
```

---

## 4️⃣ Frontend (Angular)

### Components

* Filters sidebar (desktop)
* Slide drawer (mobile)
* Price range slider
* Category dropdown
* Boutique dropdown
* Promotion toggle
* Sort selector

### UX Rules

* Sticky filter sidebar (desktop)
* Clear filter button
* Visible active filters tags
* Promotion badge highlighted
* Old price strikethrough

---

## 5️⃣ Business Enforcement

* Server-side filter validation mandatory
* Expired promotions auto-hidden
* Price range sanity check
* Suspended boutiques excluded

---

## 6️⃣ Acceptance Criteria

* [ ] All filters combinable
* [ ] Promotion logic correct
* [ ] Responsive filter UI
* [ ] Expired promotions hidden
* [ ] Query performance optimized with indexes
