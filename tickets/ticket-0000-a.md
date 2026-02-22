Here is your structured and complete UI architecture ticket.

---

# 🎟 TICKET: UI-ADMIN-001

# 🏢 Layout Backoffice – Responsable Centre Commercial

---

## 🎯 Objective

Create the **complete reusable layout structure** for the
**Responsable Centre Commercial (Super Admin) Backoffice**.

The layout must include:

* Header
* Top Navbar (with notification icons)
* Sidebar (collapsible + dynamic menu)
* Footer
* Main content wrapper
* Responsive behavior
* Route outlet integration

This layout will be reused across all admin pages.

---

# 📦 Fonctionnalité: Admin Backoffice Layout

```text
Fonctionnalité UI-ADMIN-001
│
├── BDD (Mongo) ❌ (Not required)
├── Backend (Node / Express) ❌ (Not required)
├── API Contract ⚠ (Optional – notifications later)
└── Frontend (Angular) ✅
```

---

# 1️⃣ Scope Clarification

This ticket concerns:

✔ UI structure
✔ Navigation architecture
✔ Layout reusability
✔ Responsive design
✔ Clean Angular structure

This ticket does NOT include:

* Dashboard statistics logic
* Real notification system logic
* Business CRUD logic

---

# 2️⃣ Frontend Architecture (Angular)

---

## 📁 Folder Structure

```text
src/app/admin/
│
├── layout/
│   ├── layout.component.ts
│   ├── layout.component.html
│   ├── layout.component.css
│
├── components/
│   ├── sidebar/
│   ├── navbar/
│   ├── header/
│   ├── footer/
│
├── pages/
│   ├── dashboard/
│   ├── sellers/
│   ├── contracts/
│   ├── spaces/
│
└── admin-routing.module.ts
```

---

# 3️⃣ Layout Global Structure

## 📐 Main Layout Structure

```html
<app-navbar></app-navbar>

<div class="admin-container">
    <app-sidebar></app-sidebar>

    <div class="main-content">
        <router-outlet></router-outlet>
        <app-footer></app-footer>
    </div>
</div>
```

---

# 4️⃣ Components Breakdown

---

# 🧭 1️⃣ Sidebar Component

## 🎯 Features

* Collapsible
* Highlight active route
* Nested menu support
* Icons
* Smooth transition
* Role-based menu ready

---

## 📋 Sidebar Menu Structure

```text
Dashboard
Gestion Locataires
   ├── Liste vendeurs
   ├── Contrats
   ├── Espaces (Box / Kiosque / Stand)
Finances
Statistiques
Paramètres
```

---

## 📌 Behavior

* Toggle button collapses sidebar
* When collapsed → icons only
* When expanded → icons + labels
* Active route highlighted
* Mobile → overlay mode

---

---

# 🔔 2️⃣ Navbar Component

## 🎯 Features

* Display admin name
* Notification bell icon
* Messages icon
* Profile dropdown
* Logout button
* Sidebar toggle button (hamburger)

---

## 📋 Navbar Elements

Left:

* ☰ Sidebar toggle

Right:

* 🔔 Notifications icon (badge counter)
* 💬 Messages icon (optional placeholder)
* 👤 Admin dropdown:

    * Profile
    * Settings
    * Logout

---

## 📌 Future Ready

Notification dropdown placeholder:

```text
- Nouveau vendeur en attente
- Contrat expirant bientôt
- Paiement en retard
```

---

# 🏷 3️⃣ Header Component

Optional page header inside main content:

```text
Page Title
Breadcrumb
```

Example:

```text
Dashboard / Gestion Locataires / Liste
```

---

# 📄 4️⃣ Footer Component

Simple:

```text
© 2026 Centre Commercial - Backoffice
Version 1.0.0
```

Sticky bottom behavior.

---

# 5️⃣ Routing Architecture

---

## 📌 Admin Routing

All admin pages must use LayoutComponent as wrapper.

```ts
{
  path: 'admin',
  component: LayoutComponent,
  canActivate: [AuthGuard, AdminGuard],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'sellers', component: SellerListComponent },
    { path: 'contracts', component: ContractListComponent },
    { path: 'spaces', component: RentalSpaceListComponent }
  ]
}
```

---

# 6️⃣ UI/UX Requirements

---

## 🎨 Design Rules

* Clean professional look
* Neutral color palette
* Primary color: dark blue or dark gray
* Sidebar dark theme
* Main content light background
* Consistent spacing
* Modern minimal design

---

## 📱 Responsive Rules

| Screen  | Behavior            |
| ------- | ------------------- |
| Desktop | Sidebar expanded    |
| Tablet  | Sidebar collapsible |
| Mobile  | Sidebar overlay     |

---

# 7️⃣ Technical Constraints

* Angular only
* No backend changes
* Use Angular Router
* Use Angular animations for collapse
* Use CSS Flexbox or Grid
* No jQuery
* No inline styles
* Modular components

---

# 8️⃣ Security Considerations

* Entire layout protected by:

    * AuthGuard
    * AdminGuard

* Logout must:

    * Clear token
    * Redirect to /login

---

# 9️⃣ Optional Enhancements (Future Ready)

* Dark / Light mode toggle
* Dynamic menu from backend
* Real-time notifications via WebSocket
* Badge counters connected to API
* Breadcrumb service

---

# 🔟 Acceptance Criteria ✅

✔ Sidebar collapsible
✔ Active route highlighted
✔ Navbar displays admin info
✔ Logout works
✔ Layout reusable
✔ All admin pages wrapped inside layout
✔ Responsive design working
✔ Clean Angular architecture respected

---

# 1️⃣1️⃣ Definition of Done

* LayoutComponent implemented
* SidebarComponent implemented
* NavbarComponent implemented
* FooterComponent implemented
* Routing integrated
* Guards enforced
* Code modular
* No duplicated layout in pages
* Clean folder structure

---

# 🚀 Why This Ticket Is Important

This layout becomes the foundation for:

* Dashboard
* Seller management
* Contracts
* Financial tracking
* Analytics
* Future scalability

Without this ticket, UI becomes inconsistent.
