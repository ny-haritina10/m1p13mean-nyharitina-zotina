# 🎟 TICKET: FIN-ADMIN-005

# 📊 Financial Reporting & Facturation (Mensuel / Annuel)

---

## 🎯 Objective

Allow the **Responsable Centre Commercial (Admin)** to:

* View financial reports (monthly & yearly)
* Track revenue performance
* View complete payment history
* Generate PDF invoices for rent payments
* Export financial summaries

Allow the **Seller (Boutique)** to:

* View payment history
* Download their rent invoices (PDF)

This ticket builds on:

* Contract management
* Rent payment management

---

# 📦 Fonctionnalité: Financial Reporting & Facturation

```text
Fonctionnalité FIN-ADMIN-005
│
├── BDD (Mongo)
├── Backend (Node / Express)
├── API Contract
└── Frontend (Angular)
```

---

# 1️⃣ BDD (MongoDB)

We reuse:

* `rentpayments`
* `contracts`
* `users`

---

## 📂 Optional New Collection: invoices

If persistent invoice tracking is required.

### Schema

```js
{
  rentPayment: ObjectId(RentPayment),
  invoiceNumber: String,          // Unique reference
  issueDate: Date,
  pdfPath: String,                // Stored file path or URL
  totalAmount: Number,
  status: String,                 // "generated" | "sent"
  createdAt: Date
}
```

---

## 📌 Indexes

```js
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ rentPayment: 1 });
```

---

# 2️⃣ Backend (Node / Express – JavaScript only)

---

# 📁 Service Layer

---

## 📊 FinancialReportService.js

Responsibilities:

* getMonthlyReport(month, year)
* getYearlyReport(year)
* getRevenueSummary()
* getUnpaidSummary()
* getSellerFinancialHistory(sellerId)

---

## 📄 InvoiceService.js

Responsibilities:

* generateInvoice(rentPaymentId)
* generateInvoiceNumber()
* buildInvoicePDF(data)
* storeInvoice()
* downloadInvoice(invoiceId)

---

---

# 3️⃣ Financial Reporting Logic

---

## 📌 Monthly Report

For a given month/year:

Return:

```json
{
  "totalExpectedRevenue": 15000000,
  "totalCollected": 12000000,
  "totalUnpaid": 3000000,
  "latePayments": 4,
  "paidCount": 20,
  "unpaidCount": 5
}
```

---

## 📌 Yearly Report

Return:

```json
{
  "year": 2026,
  "totalRevenue": 180000000,
  "monthlyBreakdown": [
    { "month": 1, "revenue": 15000000 },
    { "month": 2, "revenue": 17000000 }
  ]
}
```

---

# 4️⃣ Backend Routes

---

## 📊 Reporting Routes (Admin Only)

```http
GET /api/admin/reports/monthly?month=1&year=2026
GET /api/admin/reports/yearly?year=2026
GET /api/admin/reports/summary
```

Protected by:

* authMiddleware
* roleMiddleware("admin")

---

## 📜 Payment History

Admin:

```http
GET /api/admin/rents/history
```

Seller:

```http
GET /api/seller/rents/history
```

---

## 📄 Invoice Routes

Generate invoice:

```http
POST /api/admin/invoices/:rentPaymentId
```

Download invoice:

```http
GET /api/admin/invoices/:invoiceId/download
GET /api/seller/invoices/:invoiceId/download
```

---

# 5️⃣ Invoice PDF Structure

Invoice must contain:

---

## 🧾 Invoice Content

```
Centre Commercial Name
Address
Contact

Invoice Number: INV-2026-0001
Issue Date: 01/02/2026

Seller:
Boutique Name
Seller Name
Contract Reference

Rental Period:
Month: January 2026

Base Rent: 500 000 Ar
Penalty: 25 000 Ar
Total Amount: 525 000 Ar

Payment Status: Paid / Late / Pending
```

---

## 📌 PDF Requirements

* Professional layout
* Unique invoice number format:

```
INV-YYYY-XXXX
```

Example:

```
INV-2026-0001
```

* Generated dynamically
* Downloadable
* Stored or regenerated on request

Use:

* pdfkit or similar PDF library (Node JS compatible)

---

# 6️⃣ Frontend (Angular)

---

# 📁 Module

```text
admin/
  financial-reporting/
  invoices/
```

---

# 📊 Components (Admin)

---

### 1️⃣ FinancialDashboardComponent

Displays:

* Monthly revenue card
* Yearly revenue card
* Unpaid total
* Late payment count
* Revenue graph (bar chart)

---

### 2️⃣ MonthlyReportComponent

Filters:

* Month
* Year

Displays:

* Revenue summary
* Table of payments

---

### 3️⃣ YearlyReportComponent

Displays:

* Monthly revenue breakdown
* Graph visualization

---

### 4️⃣ PaymentHistoryComponent

Table:

| Seller | Month | Amount | Penalty | Total | Status | Invoice |

Invoice column:

* Download button

---

---

# 📦 Seller Components

---

### SellerFinancialHistoryComponent

Shows:

| Month | Year | Total | Status | Invoice |

Seller can:

* Download their invoice

---

# 7️⃣ Business Enforcement

---

## 📌 Invoice Rules

* Invoice can only be generated if:

    * Rent exists
    * Contract valid
* Cannot generate duplicate invoice
* Invoice number must be unique

---

## 📌 Security

Seller:

* Can only access own invoices
  Admin:
* Can access all

---

# 8️⃣ Dashboard Impact

Admin dashboard enhanced with:

* Revenue trend charts
* Financial KPIs
* Late payment alerts
* Payment compliance rate

---

# 9️⃣ Acceptance Criteria ✅

✔ Monthly financial report works
✔ Yearly financial report works
✔ Accurate aggregation from DB
✔ Admin can view complete payment history
✔ Seller can view own payment history
✔ Invoice PDF generated
✔ Invoice downloadable
✔ Invoice number unique
✔ Role-based security enforced
✔ Clean REST architecture respected

---

# 🔟 Definition of Done

* Aggregation queries optimized
* PDF properly formatted
* Invoice number generation tested
* Role protection implemented
* Angular charts integrated
* No TypeScript in backend
* Clean separation of concerns
* Tested with realistic data
