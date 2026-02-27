---

# 🎟 TICKET: FO-CUST-001

# Création Compte Client & Mode Invité (Front-Office)

---

## 🎯 Objective

Permettre aux visiteurs du centre commercial digital :

* De créer un compte client
* De naviguer en mode invité sans authentification

### Problème résolu

Réduire la friction d’entrée tout en permettant la conversion vers compte enregistré.

### Utilisateurs

Customer (invité ou inscrit)

### Business Value

* Augmentation du taux d’inscription
* Collecte de données clients
* Préparation future (commande, wishlist, fidélité)

---

# 📦 Fonctionnalité: Customer Authentication (Front-Office)

```
FO-CUST-001
│
├── BDD
├── Backend
├── API Contract
└── Frontend
```

---

## 1️⃣ BDD (MongoDB)

### Collection: users

```js
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String, // hashed
  role: String, // CUSTOMER
  status: String, // ACTIVE | BLOCKED
  createdAt: Date
}
```

### Indexes

```js
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

### Constraints

* Email unique
* Password hashed (bcrypt)
* role fixed = CUSTOMER for front registration

---

## 2️⃣ Backend (Node / Express)

### Service Layer

* registerCustomer()
* loginCustomer()

Rules:

* Email unique
* Password min 8 chars
* Status must be ACTIVE for login

---

### Endpoints

```
POST /api/customers/register
POST /api/customers/login
```

Guest mode:

* No authentication required for browsing
* JWT only required for protected features

---

### Middleware

* JWT auth (optional for FO browsing)
* Role guard (CUSTOMER only)

---

## 3️⃣ API Contract

### Register

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@mail.com",
  "password": "StrongPass123"
}
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

---

## 4️⃣ Frontend (Angular)

### Pages

* /register
* /login

### UX Rules (Front-Office)

* Minimal form fields
* Inline validation
* Mobile-first layout
* Clear CTA buttons
* No mandatory login to browse

---

## 5️⃣ Acceptance Criteria

* [ ] Email unique validation
* [ ] Password hashed
* [ ] Guest browsing allowed
* [ ] JWT returned on login
* [ ] Responsive UI
