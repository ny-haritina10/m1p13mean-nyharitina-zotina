---

# 🎟 TICKET: FO-CUST-002

# Recherche Produits & Affichage en Cartes (Front-Office)

---

## 🎯 Objective

Permettre aux visiteurs (invités ou clients connectés) de :

* Rechercher des produits par mot-clé
* Voir les résultats paginés
* Visualiser les produits sous forme de **cartes avec images**
* Identifier les promotions et le stock en un coup d'œil

### Problème résolu

Le ticket précédent ne spécifiait pas clairement l’obligation d’un affichage en cartes, pourtant indispensable pour un front-office e-commerce orienté image.

### Business Value

* Expérience moderne type marketplace
* Meilleure conversion
* Mise en valeur des images produits
* UX mobile-first optimisée

---

# 📦 Fonctionnalité: Product Search + Card Display

```
FO-CUST-002
│
├── BDD
├── Backend
├── API Contract
└── Frontend (Card-based UI mandatory)
```

---

# 1️⃣ BDD (MongoDB)

⚠ Aligné avec votre vrai modèle.

## Collection: products

```js
{
  seller: ObjectId,              // ref User
  name: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  images: [String],
  status: 'active' | 'inactive' | 'out_of_stock',
  isPromotional: Boolean,
  promotionalPrice: Number,
  promotionalStartDate: Date,
  promotionalEndDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Indexes (Performance Critique)

```js
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ status: 1 })
db.products.createIndex({ category: 1 })
db.products.createIndex({ seller: 1 })
db.products.createIndex({ createdAt: -1 })
```

---

## Business Visibility Constraints (DB + Service Layer)

Produit visible en Front-Office uniquement si :

```
status === 'active'
AND stock > 0 (option business configurable)
AND seller.status === 'APPROVED'
```

⚠ `inactive` et `out_of_stock` ne doivent pas apparaître dans la recherche FO.

---

# 2️⃣ Backend (Node / Express — JavaScript only)

---

## Service Layer

### searchProducts({ search, page, limit })

### Responsibilities

* Apply text search
* Enforce visibility rules
* Pagination
* Lightweight projection
* Compute promotionActive flag

---

## Business Rules

### Promotion Active Condition

Promotion considérée active uniquement si :

```
isPromotional === true
AND promotionalStartDate <= now
AND promotionalEndDate >= now
```

Même si le hook `pre('save')` existe, la validation DOIT être recontrôlée côté service.

---

## Projection (Performance)

Ne jamais retourner description complète en liste :

```js
{
  name: 1,
  price: 1,
  promotionalPrice: 1,
  isPromotional: 1,
  promotionalStartDate: 1,
  promotionalEndDate: 1,
  images: { $slice: 1 },
  stock: 1,
  status: 1
}
```

---

## Endpoint

```
GET /api/products?search=phone&page=1&limit=12
```

---

## Response DTO

```json
{
  "success": true,
  "data": [
    {
      "id": "64abc",
      "name": "Nike Air Max",
      "price": 200000,
      "promotionActive": true,
      "promotionalPrice": 150000,
      "image": "img1.jpg",
      "stock": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "pages": 10
  }
}
```

---

## Error Cases

* 400 – Invalid pagination
* 500 – Internal error
* 429 – Rate limit exceeded

---

## Middleware

* Rate limiter (anti scraping)
* Query validation
* Sanitization (anti NoSQL injection)

---

# 3️⃣ API Contract

## Query Parameters

| Param  | Type   | Required | Description     |
| ------ | ------ | -------- | --------------- |
| search | string | no       | Text search     |
| page   | number | yes      | Pagination page |
| limit  | number | yes      | Items per page  |

---

## Validation Rules

* page >= 1
* limit <= 50
* search sanitized

---

# 4️⃣ Frontend (Angular — FRONT-OFFICE CRITICAL)

⚠ THIS IS IMAGE-DRIVEN UI
⚠ CARD-BASED GRID IS MANDATORY

---

## Module Structure

```
frontoffice/
  products/
    pages/
      product-list/
    components/
      product-card/
      search-bar/
      empty-state/
      loading-skeleton/
    services/
      product.service.ts
```

---

## Product List Page (/products)

---

## 🔷 Mandatory Component: product-card

Reusable component:

```
product-card.component.ts
```

---

## 🔷 Card Layout (Required Elements)

Each card MUST contain:

1. Product image (`images[0]`)
2. Product name
3. Price
4. Promotional price (if active)
5. Promotion badge
6. Stock badge (if low stock optional)
7. CTA button (“Voir détail”)

---

## 🔷 Image Handling Rules

* If images array not empty → show first image
* If empty → show default placeholder
* Use:

  * lazy loading
  * fixed aspect ratio
  * fallback image on error
* Max height consistent across grid

---

## 🔷 Promotional UI Rules

If promotionActive = true:

* Old price → strikethrough
* Promotional price → highlighted
* Badge “Promotion” visible
* Strong visual contrast

---

## 🔷 Stock Rules

| Condition                  | UI Behavior                   |
| -------------------------- | ----------------------------- |
| stock > 0                  | Normal                        |
| stock <= lowStockThreshold | Optional “Stock faible” badge |
| status != active           | MUST NOT DISPLAY              |

---

## 🔷 Responsive Rules (Strict)

Desktop ≥ 1400px → 4 columns
Desktop ≥ 1024px → 3 columns
Tablet ≥ 768px → 2 columns
Mobile → 1 column

Spacing consistent
Clickable area entire card
Hover effect desktop only

---

## 🔷 UX Requirements

* Loading skeleton while fetching
* Empty state illustration
* Smooth pagination transition
* Scroll restoration on page change
* SEO-friendly routing
* Accessible (ARIA labels on images/buttons)

---

# 5️⃣ Business Enforcement

Server-side only:

* Filter inactive products
* Filter suspended sellers
* Validate promotions
* Validate pagination
* Prevent mass scraping

Optional enhancement:

* Cache first 3 pages (Redis future)

---

# 6️⃣ Dashboard Impact

Metrics affected:

* Search count
* Product impressions
* Promotion impressions
* Click-through rate
* Most viewed products

Future-ready for analytics module.

---

# 7️⃣ Acceptance Criteria ✅

* [ ] Only active products visible
* [ ] Suspended seller products hidden
* [ ] Pagination works
* [ ] Card layout implemented
* [ ] Image fallback implemented
* [ ] Promotion logic correct
* [ ] Mobile responsive
* [ ] Skeleton loading implemented
* [ ] No full description in list response
* [ ] Indexes created in Mongo

---

# 8️⃣ Definition of Done

### Architecture

* Clean separation (Controller → Service → Model)
* No business logic in controller
* Projection used
* Indexes verified

### Security

* Sanitized queries
* Rate limiting enabled
* No overexposed fields

### Performance

* Lean queries
* Image optimized (compressed externally)
* Max limit enforced

### Frontend

* Reusable card component
* Mobile-first
* Accessible
* No UI logic tied to backend internals