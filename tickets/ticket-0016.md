# 🎟 TICKET: FO-CUST-004

# Fiche Produit (Front-Office Product Detail Page)

---

## 🎯 Objective

Permettre aux visiteurs (invité ou client connecté) de consulter la **fiche détaillée d’un produit** avec :

* Photos
* Prix (normal / promotionnel)
* Disponibilité
* Localisation de la boutique dans le centre commercial

### Problème résolu

La page liste affiche un résumé.
La fiche produit fournit les informations complètes nécessaires à la décision d’achat.

### Business Value

* Augmente le taux de conversion
* Met en valeur les visuels
* Facilite la visite physique du centre commercial
* Améliore l’expérience omnicanale (digital ↔ physique)

### System Impact

* Dépend des modules : Products, Sellers, Shopping Center Layout
* Impacte analytics (product views, engagement)

---

# 📦 Fonctionnalité: Product Detail Page

```id="x4k8pz"
FO-CUST-004
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

## Collection: products (existant)

Utilisation des champs existants :

```js id="q7m2la"
{
  seller: ObjectId,
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
  promotionalEndDate: Date
}
```

---

## Collection: users (seller)

Doit contenir :

```js id="p9zt3r"
{
  _id: ObjectId,
  role: "SELLER",
  status: "APPROVED" | "SUSPENDED",
  boutiqueName: String,
  mallLocation: {
    zone: String,     // Ex: "Zone A"
    floor: String,    // Ex: "R+1"
    unitNumber: String // Ex: "B12"
  }
}
```

---

## Indexes

```js id="y5z3dt"
db.products.createIndex({ _id: 1 })
db.products.createIndex({ status: 1 })
db.products.createIndex({ seller: 1 })
```

---

## Visibility Constraints

Produit visible en FO uniquement si :

```id="t6mz8v"
status === 'active'
AND seller.status === 'APPROVED'
```

---

# 2️⃣ Backend (Node / Express — JavaScript only)

---

## Service Layer

### Method

```js id="s2mdq1"
getProductDetail(productId)
```

---

## Responsibilities

* Validate ObjectId
* Check product visibility
* Join seller info (boutique name + localisation)
* Compute promotionActive
* Format response DTO

---

## Promotion Logic (Server-side Mandatory)

```id="c4v8bx"
isPromotional === true
AND promotionalStartDate <= now
AND promotionalEndDate >= now
```

---

## Endpoint

```id="j3w9an"
GET /api/products/:id
```

---

## Error Cases

* 400 – Invalid ID
* 404 – Product not found
* 403 – Product inactive or seller suspended
* 500 – Internal error

---

## Middleware

* Optional auth (guest allowed)
* ID validation middleware
* Rate limiter

---

# 3️⃣ API Contract

---

## Response DTO

```json id="u9v4pf"
{
  "success": true,
  "data": {
    "id": "64abc",
    "name": "Nike Air Max",
    "description": "Description complète...",
    "price": 200000,
    "promotionActive": true,
    "promotionalPrice": 150000,
    "stock": 8,
    "status": "active",
    "images": ["img1.jpg", "img2.jpg"],
    "boutique": {
      "name": "Sport Shop",
      "location": {
        "zone": "Zone A",
        "floor": "R+1",
        "unitNumber": "B12"
      }
    }
  }
}
```

---

## Validation Rules

* ID must be valid ObjectId
* Product must respect visibility rules
* Promotion logic recalculated server-side

---

# 4️⃣ Frontend (Angular — Front-Office Critical UX)

⚠ High visual impact page
⚠ Must be mobile-first and conversion-oriented

---

## Module Structure

```id="m8g3fr"
frontoffice/products/
  pages/
    product-detail/
  components/
    image-gallery/
    price-display/
    stock-badge/
    boutique-location/
```

---

## Route

```id="a4r6lt"
/products/:id
```

---

## UI Structure

---

### 🔷 1. Image Gallery (Mandatory)

* Main large image
* Thumbnail carousel
* Click to zoom (desktop)
* Swipe support (mobile)
* Fallback image if empty array
* Lazy loading enabled

---

### 🔷 2. Price Display

If promotion active:

* Old price → strikethrough
* Promotional price → highlighted
* “Promotion” badge visible

If no promotion:

* Standard price only

---

### 🔷 3. Disponibilité

| Condition | UI                                           |
| --------- | -------------------------------------------- |
| stock > 0 | “En stock” (green badge)                     |
| stock low | “Stock faible” (orange badge)                |
| stock = 0 | “Rupture de stock” (red badge, CTA disabled) |

---

### 🔷 4. Localisation Boutique

Displayed clearly:

Exemple :

```
Zone A – R+1 – Boutique B12
```

UX Rules:

* Use icon (📍)
* Clickable link to future “Mall Map” page
* Highlight floor level

---

## Responsive Layout

Desktop:

* Left: image gallery (60%)
* Right: info (40%)

Mobile:

* Images on top
* Info stacked
* Sticky bottom CTA (future-ready)

---

## UX Requirements

* Loading skeleton
* Smooth image transitions
* Accessible alt text
* SEO meta tags
* Scroll to top on load
* Breadcrumb navigation

---

# 5️⃣ Business Rules Enforcement

* Inactive products never accessible
* Suspended seller products blocked
* Promotion validated server-side
* Stock status derived from backend only

Optional future:

* View counter increment
* Recently viewed tracking

---

# 6️⃣ Dashboard Impact

Metrics added:

* Product detail views
* Promotion engagement rate
* Boutique visibility
* Conversion funnel step tracking

---

# 7️⃣ Acceptance Criteria ✅

* [ ] Product visible only if active
* [ ] Seller must be approved
* [ ] Image gallery implemented
* [ ] Promotion logic correct
* [ ] Stock badge accurate
* [ ] Boutique localisation displayed
* [ ] Responsive layout implemented
* [ ] Loading state implemented
* [ ] 404 handled correctly

---

# 8️⃣ Definition of Done

### Architecture

* Controller thin
* Service handles business logic
* Proper projection & lean queries

### Security

* ID validation
* No sensitive seller data exposed
* Sanitized responses

### Performance

* Indexed queries
* Images optimized
* Lean population

### Frontend

* Reusable components
* Accessible
* Mobile-first
* No hardcoded business logic