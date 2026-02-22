
## 4️⃣ Core Functional Modules

### 🔐 Authentication Module

* JWT authentication
* Role-based access control
* Secure password hashing (bcrypt)
* Email uniqueness

---

### 🏬 Boutique Management

* Boutique profile
* Status (pending / approved / suspended)
* Logo upload
* Description
* Category

---

### 📦 Product Management

* Name
* Description
* Price
* Stock
* Images
* Category
* Promotion (optional discount)
* Boutique reference

---

### 🛒 Order System

* Cart system
* Order validation
* Order status:

    * pending
    * confirmed
    * shipped
    * delivered
    * cancelled
* Order history

---

### ⭐ Review System

* Rating (1–5)
* Comment
* Linked to product & customer

---

### 📊 Dashboard & Statistics

Admin dashboard:

* Total boutiques
* Total users
* Total orders
* Revenue overview
* Most sold products

Boutique dashboard:

* Total sales
* Monthly revenue
* Best selling products


## 6️⃣ API Architecture Rules

* RESTful routes:

    * `/api/auth`
    * `/api/users`
    * `/api/boutiques`
    * `/api/products`
    * `/api/orders`
    * `/api/reviews`

* Controllers separated from routes

* Use services layer if complexity increases

* Proper error handling middleware

* Use async/await

* Input validation required

---

## 7️⃣ Angular Frontend Architecture

Suggested structure:

```
src/app/
  core/
  shared/
  auth/
  admin/
  boutique/
  customer/
  products/
  orders/
```

* AuthGuard
* RoleGuard
* JWT Interceptor
* Shared components (navbar, footer, sidebar)

---

## 8️⃣ Business Logic Rules

* A boutique cannot sell products if not approved.
* Customers cannot review products they did not purchase.
* Admin can suspend boutiques or users.
* Stock must decrease automatically after order confirmation.
* Cannot order product with stock = 0.
* Each email must be unique.

---

## 9️⃣ Non-Functional Requirements

* Secure authentication
* Clean UI/UX
* Responsive design
* Maintainable code
* Proper folder structure
* Scalable architecture
* No hardcoded credentials
* Environment variables (.env)

---