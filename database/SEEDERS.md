# Database Seeders

This document describes all database seeders and how to run them.

## Clear Database

To clear all data before seeding:
```bash
cd backend
node seeders/clearDatabase.js
```

Or drop the entire database:
```bash
cd backend
node -e "require('mongoose').connect(process.env.MONGO_URI).then(m => m.connection.dropDatabase().then(() => m.disconnect()))"
```

## Run All Seeders

To run all seeders in sequence (from fresh database):
```bash
cd backend
node seeders/clearDatabase.js
npm run seed
```

**Note:** Due to connection handling issues, it's recommended to run seeders individually.

## Run Seeders Individually

Run these commands in order:

```bash
cd backend

# 1. Admin user
node seeders/userSeeder.js

# 2. Sellers (5 vendeurs)
node seeders/sellerSeeder.js

# 3. Rental Spaces
node seeders/rentalSpaceSeeder.js

# 4. Contracts
node seeders/contractSeeder.js

# 5. Rent Payments
node seeders/rentPaymentSeeder.js

# 6. Seller Data (Boutique, Categories, Products for vendeur1)
node seeders/sellerDataSeeder.js

# 7. Stock Movements
node seeders/stockMovementSeeder.js

# 8. Sales
node seeders/saleSeeder.js

# 9. Daily Sales
node seeders/dailySalesSeeder.js

# 10. Orders (includes customers)
node seeders/orderSeeder.js
```

## Seeded Data Summary

| Seeder | Description | Records |
|--------|-------------|--------|
| userSeeder.js | Admin user | 1 admin |
| sellerSeeder.js | 5 sellers (vendeurs) | 5 sellers |
| rentalSpaceSeeder.js | Additional rental spaces | 8 spaces |
| contractSeeder.js | Contracts for all sellers | 5 contracts |
| rentPaymentSeeder.js | Rent payments (3 months) | 15 payments |
| sellerDataSeeder.js | Boutique, categories, products for vendeur1 | 1 boutique, 4 categories, 12 products |
| stockMovementSeeder.js | Stock movements for vendeur1 | 36 movements |
| saleSeeder.js | Sales for vendeur1 | 15 sales |
| dailySalesSeeder.js | Daily sales (last 7 days) | 25 sales |
| orderSeeder.js | Orders + 5 customers | 12 orders, 5 customers |

## Credentials

### Admin
- Username: `admin`
- Password: `admin`

### Sellers (Vendeurs)
| Username | Password | Boutique Name |
|----------|----------|---------------|
| vendeur1 | password123 | Mode Élégance |
| vendeur2 | password123 | Tech Store |
| vendeur3 | password123 | Casa Comfort |
| vendeur4 | password123 | Beauté Naturelle |
| vendeur5 | password123 | Accessoires Premium |

### Customers
| Username | Email | Password |
|----------|-------|----------|
| customer1 | rasoa@example.com | password123 |
| customer2 | mbola@example.com | password123 |
| customer3 | tahiana@example.com | password123 |
| customer4 | fanilo@example.com | password123 |
| customer5 | miaraka@example.com | password123 |

## Quick Seed Command (One-liner)

Run all seeders in sequence:
```bash
cd backend && node seeders/userSeeder.js && node seeders/sellerSeeder.js && node seeders/rentalSpaceSeeder.js && node seeders/contractSeeder.js && node seeders/rentPaymentSeeder.js && node seeders/sellerDataSeeder.js && node seeders/stockMovementSeeder.js && node seeders/saleSeeder.js && node seeders/dailySalesSeeder.js && node seeders/orderSeeder.js
```
