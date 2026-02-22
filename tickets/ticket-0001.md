Here is the **complete structured ticket** following your project architecture and MEAN constraints.

You can reuse this format for every future functionality.

---

# 🎟 TICKET: AUTH-001

# 🔐 Auth – Connexion Super Admin

---

## 🎯 Objective

Allow the **Super Admin (Responsable Centre Commercial)** to:

* Login using **username + password**
* Be authenticated via JWT
* Be redirected to a simple **Admin Home Page**
* Have a default seeded account:

    * username: `admin`
    * password: `admin`

---

# 📦 Fonctionnalité: Auth – Super Admin Login

```
Fonctionnalité AUTH-001
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

## 📂 Collection: users

### Schema Fields

```js
{
  username: String (required, unique, index),
  password: String (required, hashed),
  role: String (enum: ["admin", "boutique", "customer"]),
  status: String (enum: ["active", "suspended"]),
  createdAt: Date
}
```

---

## 📌 Index

* Unique index on `username`

```js
userSchema.index({ username: 1 }, { unique: true });
```

---

## 🌱 Seeder

Create a seeder script:

### Default Admin

```
username: admin
password: admin (hashed with bcrypt)
role: admin
status: active
```

Rules:

* If admin already exists → do nothing
* Password must be hashed
* Seeder runs on server start or manually

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

## 📁 Model

**UserModel.js**

* Mongoose schema
* bcrypt hashing middleware (pre-save optional)
* method: comparePassword()

---

## 📁 Service

**AuthService.js**

Responsibilities:

* Validate credentials
* Check user exists
* Compare password
* Check status = active
* Generate JWT token

JWT Payload:

```js
{
  userId,
  role,
  username
}
```

JWT expiration: 1 day

---

## 📁 Controller

**AuthController.js**

Method:

```js
POST /api/auth/login
```

Responsibilities:

* Validate input
* Call AuthService
* Return token + user info

Success Response:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

Error Cases:

* 401 Invalid credentials
* 403 Suspended account

---

## 📁 Route

**auth.routes.js**

```js
router.post("/login", AuthController.login);
```

---

## 📁 Middleware

### 1️⃣ authMiddleware.js

* Verify JWT
* Attach user to request

### 2️⃣ roleMiddleware.js

* Allow only role === "admin"

---

# 3️⃣ API Contract

## 📥 Request DTO

```json
{
  "username": "string",
  "password": "string"
}
```

Validation Rules:

* username required
* password required
* minimum length 4

---

## 📤 Response DTO

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
```

---

# 4️⃣ Frontend (Angular)

---

## 📁 Module

Create:

```
auth/
  auth.module.ts
```

---

## 📁 Components

### 1️⃣ LoginComponent

Fields:

* username
* password
* submit button

---

## 📁 HTML

Simple form:

```
Username input
Password input
Login button
Error message
```

---

## 📁 Service API

**auth.service.ts**

Method:

```ts
login(credentials)
```

* POST to `/api/auth/login`
* Store token in localStorage
* Store user role
* Return observable

---

## 📁 Routing

### Routes

```
/login
/admin/home
```

---

## 📁 Guards

### AuthGuard

* Check if token exists

### AdminGuard

* Check role === admin

---

# 5️⃣ After Successful Login

Redirect to:

```
/admin/home
```

---

## 🏠 Admin Home Page

Component: `AdminHomeComponent`

Simple UI:

```
Bienvenue, Admin 👋
Vous êtes connecté en tant que Super Administrateur.
```

This page must:

* Be protected by AuthGuard + AdminGuard
* Be inaccessible without token

---

# 6️⃣ Security Rules

* Password must be hashed (bcrypt)
* Never return password in API response
* JWT secret stored in `.env`
* Token verified on each protected route

---

# 7️⃣ Acceptance Criteria ✅

✔ Admin seeded automatically
✔ Admin can login with admin/admin
✔ Wrong credentials return 401
✔ Suspended account blocked
✔ Token stored in frontend
✔ Protected route requires JWT
✔ Redirect to /admin/home
✔ Welcome message displayed

---

# 8️⃣ Definition of Done

* Seeder works
* Login works
* JWT verified
* Guards implemented
* No hardcoded secrets
* Clean folder structure respected
* No TypeScript in backend
* Follows MEAN constraints