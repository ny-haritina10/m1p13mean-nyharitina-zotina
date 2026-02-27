---

# 🎟 TICKET: FO-CART-001

# Panier Multi-Boutiques (Front-Office)

---

## 🎯 Objective

Permettre aux visiteurs (invité ou client connecté) de :

* Ajouter un produit au panier
* Gérer les quantités
* Supprimer un produit
* Voir le récapitulatif total
* Commander des produits provenant de **plusieurs boutiques différentes**

### Problème résolu

Centraliser les produits sélectionnés avant passage en commande tout en supportant un modèle marketplace multi-vendeurs.

### Business Value

* Augmentation du panier moyen
* Support du modèle multi-boutiques
* Préparation du module de commande & paiement

### System Impact

* Nouveau module Cart
* Impact futur sur module Orders
* Impact sur gestion stock (réservation logique future)

---

# 📦 Fonctionnalité: Shopping Cart (Multi-Seller)

```id="n4zt6r"
FO-CART-001
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

## Collection: carts

```js id="z8k3dp"
{
  user: ObjectId,          // null if guest
  sessionId: String,       // required if guest
  items: [
    {
      product: ObjectId,
      seller: ObjectId,
      quantity: Number,
      priceSnapshot: Number,
      promotionalPriceSnapshot: Number
    }
  ],
  updatedAt: Date,
  createdAt: Date
}
```

---

## Indexes

```js id="f7p2lt"
db.carts.createIndex({ user: 1 })
db.carts.createIndex({ sessionId: 1 })
db.carts.createIndex({ updatedAt: 1 })
```

---

## Business Constraints

* Either `user` OR `sessionId` must exist
* Quantity >= 1
* Snapshot price stored at add-to-cart time
* Product must be `status === active`
* Seller must be `APPROVED`

---

# 2️⃣ Backend (Node / Express — JavaScript only)

---

## Service Layer

### Core Methods

```js id="h9v4am"
addToCart()
updateCartItem()
removeFromCart()
getCart()
clearCart()
```

---

## Business Rules

### Add to Cart

* Validate product exists
* Validate stock >= requested quantity
* Use promotional price if promotion active
* Store price snapshot
* If item exists → increment quantity

---

### Update Quantity

* Cannot exceed available stock
* Cannot be < 1

---

### Remove Item

* Remove specific product from cart

---

### Multi-Boutique Handling

Cart structure MUST group items logically by seller in response DTO.
Order creation later will split by seller.

---

## Endpoints

```id="c5mz8x"
POST   /api/cart/add
PUT    /api/cart/item/:productId
DELETE /api/cart/item/:productId
GET    /api/cart
DELETE /api/cart/clear
```

---

## Middleware

* Optional JWT (guest allowed)
* Session ID middleware for guests
* Validation middleware
* Rate limiting

---

# 3️⃣ API Contract

---

## Add to Cart

### Request

```json id="j3v9ra"
{
  "productId": "64abc",
  "quantity": 2
}
```

---

## Cart Response

```json id="q6t2ms"
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "64abc",
        "name": "Nike Air Max",
        "seller": {
          "id": "98gh",
          "boutiqueName": "Sport Shop"
        },
        "quantity": 2,
        "unitPrice": 150000,
        "subtotal": 300000
      }
    ],
    "groupedBySeller": [
      {
        "sellerId": "98gh",
        "boutiqueName": "Sport Shop",
        "items": [...],
        "sellerSubtotal": 300000
      }
    ],
    "totalQuantity": 2,
    "grandTotal": 300000
  }
}
```

---

## Validation Rules

* quantity >= 1
* productId valid ObjectId
* stock validation mandatory
* server recalculates totals (never trust frontend)

---

# 4️⃣ Frontend (Angular — Front-Office UX Critical)

---

## Module Structure

```id="p7r4kx"
frontoffice/cart/
  pages/
    cart-page/
  components/
    cart-item/
    cart-summary/
    seller-group/
  services/
    cart.service.ts
```

---

## Route

```id="d4m2lv"
/cart
```

---

## UI Structure

---

### 🔷 Cart Page Layout

Desktop:

Left:

* Grouped by Boutique
* Cart items

Right:

* Order summary card (sticky)

Mobile:

* Stacked layout
* Summary collapsible section

---

### 🔷 Cart Item Component

Must display:

* Product image (thumbnail)
* Name
* Seller name
* Unit price
* Quantity selector (+ / -)
* Subtotal
* Remove button

---

### 🔷 Quantity Rules

* Disable "+" if stock reached
* Remove if quantity set to 0 (optional UX)

---

### 🔷 Multi-Boutique Display

Cart must visually separate products by boutique:

```
Sport Shop
  - Product A
  - Product B

Tech Store
  - Product C
```

Each group shows seller subtotal.

---

### 🔷 Summary Component

Displays:

* Total items
* Grand total
* Button: "Commander"

Future-ready for:

* Shipping fees per seller
* Taxes
* Discount codes

---

## UX Requirements

* Immediate visual feedback on add-to-cart
* Badge counter in navbar
* Optimistic UI update
* Loading indicator on actions
* Empty cart state illustration

---

# 5️⃣ Business Rules Enforcement

* Server recalculates all totals
* Cannot add inactive product
* Cannot exceed stock
* Cart persists:

    * User → DB
    * Guest → sessionId
* Expired promotions not applied

Optional Future:

* Auto-clear cart after X days
* Merge guest cart with user cart on login

---

# 6️⃣ Dashboard Impact

Metrics:

* Add-to-cart rate
* Cart abandonment rate
* Average cart value
* Multi-seller order frequency

---

# 7️⃣ Acceptance Criteria ✅

* [ ] Add to cart works
* [ ] Quantity update validated
* [ ] Remove item works
* [ ] Totals correctly calculated server-side
* [ ] Multi-boutique grouping visible
* [ ] Stock validation enforced
* [ ] Guest cart works
* [ ] Responsive UI implemented
* [ ] Empty state implemented

---

# 8️⃣ Definition of Done

### Architecture

* Clean separation Controller → Service
* No business logic in controller
* Snapshot pricing stored

### Security

* Validate product ownership
* Prevent price manipulation
* Sanitized inputs

### Performance

* Indexed cart queries
* Lean population
* Minimal product fields returned

### Frontend

* Reactive cart updates
* Mobile-first
* Accessible
* No price logic duplicated