# 🎟 TICKET: SELLER-008

# 📦 Gestion des Produits (CRUD) – Profil Vendeur

---

## 🎯 Objective

Allow the **Seller (Locataire/Vendeur)** to:

* Create, read, update, delete their products
* Upload product photos (optimized for slow connections)
* Manage stock quantities
* Receive low stock alerts
* Categorize products
* View product list with filters

---

# 📦 Fonctionnalité: Product Management

```text
Fonctionnalité SELLER-008
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

---

## 📂 New Collection: products

### Schema

```js
{
  seller: ObjectId(User),           // Reference to boutique owner
  name: String,                     // Product name
  description: String,              // Product description
  category: String,                 // Category (e.g., "Vêtements", "Accessoires")
  price: Number,                    // Price in Ariary
  stock: Number,                    // Current stock quantity
  lowStockThreshold: Number,        // Alert threshold (default: 5)
  images: [String],                 // Array of image URLs/base64
  status: String,                   // "active" | "inactive" | "out_of_stock"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📌 Indexes

```js
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ stock: 1 });
```

---

## 📌 Business Rules

* `stock < 0` → Not allowed
* `stock === 0` → status = "out_of_stock"
* `stock <= lowStockThreshold` → Low stock alert
* Images limited to 5 per product
* Each image max 500KB (compressed)

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

## 📁 Models

* Product.js

---

## 📁 Services

### ProductService.js

Responsibilities:

* createProduct(sellerId, data)
* getProductsBySeller(sellerId, filters)
* getProductById(productId, sellerId)
* updateProduct(productId, data)
* deleteProduct(productId)
* getLowStockProducts(sellerId)
* compressImage(imageBuffer)

---

## 📁 Controllers

### ProductController.js

* getAllProducts(req, res) – with filters
* getProduct(req, res)
* createProduct(req, res)
* updateProduct(req, res)
* deleteProduct(req, res)
* getLowStockAlerts(req, res)

---

## 📁 Routes

```http
GET    /api/seller/products              (boutique only)
GET    /api/seller/products/low-stock    (boutique only)
GET    /api/seller/products/:id          (boutique only)
POST   /api/seller/products              (boutique only)
PATCH  /api/seller/products/:id          (boutique only)
DELETE /api/seller/products/:id          (boutique only)
```

---

# 3️⃣ API Contract

---

## 📥 GET /api/seller/products

**Query Params:**
```
?category=Vêtements
&status=active
&search=chemise
&sortBy=createdAt
&order=desc
```

**Response:**
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Chemise Homme",
      "category": "Vêtements",
      "price": 50000,
      "stock": 15,
      "lowStockThreshold": 5,
      "status": "active",
      "images": ["data:image/jpeg;base64,..."],
      "createdAt": "2026-02-23T..."
    }
  ],
  "lowStockCount": 3
}
```

---

## 📥 POST /api/seller/products

**Request:**
```json
{
  "name": "Chemise Homme",
  "description": "Chemise en coton",
  "category": "Vêtements",
  "price": 50000,
  "stock": 20,
  "lowStockThreshold": 5,
  "images": ["data:image/jpeg;base64,..."]
}
```

**Validation:**
* name required (min 3 chars)
* price > 0
* stock >= 0
* lowStockThreshold >= 0
* max 5 images

---

## 📥 GET /api/seller/products/low-stock

**Response:**
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Produit X",
      "stock": 2,
      "lowStockThreshold": 5
    }
  ]
}
```

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module Structure

```text
src/app/seller/
├── components/
│   ├── product-list/
│   ├── product-form/
│   ├── product-detail/
│   └── low-stock-alerts/
└── services/
    └── product.service.ts
```

---

## 📁 Components

### ProductListComponent

* Table with columns: Image, Name, Category, Price, Stock, Status, Actions
* Filters: Category dropdown, Status dropdown, Search input
* Actions: Edit, Delete, View Details
* Badge for low stock items

### ProductFormComponent

* Form fields:
  * Name *
  * Description
  * Category (dropdown with custom option)
  * Price *
  * Stock *
  * Low Stock Threshold (default: 5)
  * Image Upload (multiple, max 5)
    * Drag & drop zone
    * Preview thumbnails
    * Remove image button
    * Progress indicator for upload
* Buttons: Save, Cancel

### ProductDetailComponent

* Full product information
* Image gallery
* Stock history (future enhancement)

### LowStockAlertsComponent

* List of products with stock <= threshold
* Quick action: Restock (navigate to edit with stock focus)

---

## 📁 Services

### product.service.ts

```ts
getProducts(filters?: any)
getProduct(id: string)
createProduct(data: any)
updateProduct(id: string, data: any)
deleteProduct(id: string)
getLowStockProducts()
compressImage(file: File): Promise<Blob>
```

---

## 📁 Image Optimization

### Client-side Compression

* Use browser Canvas API
* Compress to JPEG 80% quality
* Resize if > 1920px width/height
* Target: < 500KB per image

---

## 📁 Routing

```ts
{
  path: 'products',
  component: ProductListComponent
},
{
  path: 'products/create',
  component: ProductFormComponent
},
{
  path: 'products/:id/edit',
  component: ProductFormComponent
},
{
  path: 'products/:id',
  component: ProductDetailComponent
},
{
  path: 'products/alerts/low-stock',
  component: LowStockAlertsComponent
}
```

---

## 📁 Menu Update

Add to seller menu (in menuSeeder.js):

```js
{ 
  label: "Mes Produits", 
  icon: "inventory", 
  route: "/seller/products", 
  roles: ["boutique"], 
  order: 2 
}
```

---

# 5️⃣ Business Rules Enforcement

---

## 📌 Stock Management

* Cannot create product with negative stock
* Updating stock to 0 → auto set status to "out_of_stock"
* Updating stock from 0 to > 0 → auto set status to "active"

---

## 📌 Image Constraints

* Max 5 images per product
* Each image max 500KB (enforced server-side)
* Allowed formats: JPEG, PNG, WebP

---

## 📌 Seller Isolation

* Sellers can only see/edit/delete their own products
* Query always filtered by `req.user.userId`

---

# 6️⃣ Dashboard / System Impact

---

## 📌 Seller Dashboard Updates

Add widgets:

* Total Products count
* Low Stock Alert count (clickable)
* Out of Stock count

---

## 📌 Future Enhancements

* Sales analytics per product
* Stock movement history
* Automatic reorder suggestions

---

# 7️⃣ Acceptance Criteria ✅

✔ Seller can create product with all fields
✔ Seller can upload multiple images (max 5)
✔ Images compressed client-side
✔ Seller can view product list with filters
✔ Seller can edit product
✔ Seller can delete product (with confirmation)
✔ Low stock alerts displayed
✔ Stock auto-updates status
✔ Category filtering works
✔ Search by name works
✔ Seller cannot access other seller's products
│ ✔ Menu "Mes Produits" visible only for sellers

---

# 8️⃣ Definition of Done

* Product model created in MongoDB
* All CRUD endpoints implemented
* Image compression working
* Frontend components complete
│ * Menu updated with new item
* Low stock alerts functional
* Role-based protection enforced
* No TypeScript in backend
* Clean separation of concerns
* Production-ready code
