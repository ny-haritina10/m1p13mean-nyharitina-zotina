# CONTEXT.md

## 🏬 Centre Commercial Web Application – MEAN Stack

---

## 1️⃣ Project Overview

### 🎯 General Objective

Build a **MEAN Stack web application** for a shopping center (similar to

* Auchan
* E.Leclerc

The application must serve:

* 🏢 Shopping center administration
* 🏬 Boutique (shop) owners / tenants
* 🛍️ Final customers (buyers)

The platform must be adapted to the **Madagascar commercial context** (realistic payment methods, local shops, practical business logic).

---

## 2️⃣ Technical Stack (STRICT CONSTRAINTS)

### 🗄 Database

* **MongoDB**
* No SQL database
* Proper schema design using Mongoose
* Relationships handled via references (ObjectId)

### ⚙ Backend

* **Node.js**
* **Express**
* Language: **JavaScript only (NO TypeScript)**
* REST API architecture
* JWT-based authentication
* Role-based authorization middleware

### 🖥 Frontend

* **Angular**
* Can use TypeScript (recommended for Angular best practice)
* Component-based architecture
* Route Guards for protected pages
* HTTP Interceptors for JWT handling

---

## 3️⃣ User Roles

There are exactly **3 main roles**:

### 1️⃣ Admin Centre Commercial

Manages the entire platform.

Permissions:

* Manage boutiques (CRUD)
* Approve boutique registrations
* Manage categories
* View global statistics
* Suspend accounts
* Manage advertisements or featured boutiques
* Dashboard with analytics

---

### 2️⃣ Boutique (Tenant / Seller)

Represents a shop inside the mall.

Permissions:

* Manage products (CRUD)
* Manage stock
* Upload product images
* View orders
* Manage promotions
* View sales statistics
* Update boutique profile

---

### 3️⃣ Acheteur (Final Customer)

Public user who buys products.

Permissions:

* Register / Login
* Browse boutiques
* Browse products
* Search & filter
* Add to cart
* Place orders
* View order history
* Leave reviews

---

## 🔟 AI Agent Instructions (IMPORTANT)

When working on this project:

1. Always respect the MEAN stack constraint.
2. Never use TypeScript in backend.
3. Always implement role-based access control.
4. Follow REST API best practices.
5. Keep business logic realistic for Madagascar context.
6. Prioritize clean architecture and scalability.
7. Do not mix frontend and backend logic.
8. Always validate inputs.
9. Always hash passwords.
10. Prefer modular and maintainable code.