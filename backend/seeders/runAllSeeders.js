const mongoose = require('mongoose');
require('dotenv').config();

async function runAllSeeders() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    }
    console.log('===========================================');
    console.log('🚀 RUNNING ALL SEEDERS');
    console.log('===========================================\n');

    // Import seeders
    const userSeeder = require('./userSeeder.js');
    const sellerSeeder = require('./sellerSeeder.js');
    const rentalSpaceSeeder = require('./rentalSpaceSeeder.js');
    const contractSeeder = require('./contractSeeder.js');
    const rentPaymentSeeder = require('./rentPaymentSeeder.js');
    const sellerDataSeeder = require('./sellerDataSeeder.js');
    const productSeeder = require('./productSeeder.js');
    const stockMovementSeeder = require('./stockMovementSeeder.js');
    const saleSeeder = require('./saleSeeder.js');
    const dailySalesSeeder = require('./dailySalesSeeder.js');
    const orderSeeder = require('./orderSeeder.js');
    const menuSeeder = require('./menuSeeder.js');

    console.log('\n📦 Running: User (Admin)...');
    await userSeeder();
    console.log('✅ User (Admin) completed');

    console.log('\n📦 Running: Sellers (5 vendeurs)...');
    await sellerSeeder();
    console.log('✅ Sellers completed');

    console.log('\n📦 Running: Rental Spaces...');
    await rentalSpaceSeeder();
    console.log('✅ Rental Spaces completed');

    console.log('\n📦 Running: Contracts...');
    await contractSeeder();
    console.log('✅ Contracts completed');

    console.log('\n📦 Running: Rent Payments...');
    await rentPaymentSeeder();
    console.log('✅ Rent Payments completed');

    console.log('\n📦 Running: Seller Data...');
    await sellerDataSeeder();
    console.log('✅ Seller Data completed');

    console.log('\n📦 Running: Products...');
    await productSeeder();
    console.log('✅ Products completed');

    console.log('\n📦 Running: Stock Movements...');
    await stockMovementSeeder();
    console.log('✅ Stock Movements completed');

    console.log('\n📦 Running: Sales...');
    await saleSeeder();
    console.log('✅ Sales completed');

    console.log('\n📦 Running: Daily Sales...');
    await dailySalesSeeder();
    console.log('✅ Daily Sales completed');

    console.log('\n📦 Running: Orders...');
    await orderSeeder();
    console.log('✅ Orders completed');

    console.log('\n📦 Running: Menus...');
    await menuSeeder();
    console.log('✅ Menus completed');

    console.log('\n===========================================');
    console.log('✅ ALL SEEDERS COMPLETED');
    console.log('===========================================\n');

    // Print summary
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Contract = require('../models/Contract');
    const RentalSpace = require('../models/RentalSpace');
    const Sale = require('../models/Sale');
    const Order = require('../models/Order');
    const RentPayment = require('../models/RentPayment');
    const MenuItem = require('../models/MenuItem');

    console.log('📊 Database Summary:');
    console.log(`  - Admins: ${await User.countDocuments({ role: 'admin' })}`);
    console.log(`  - Sellers: ${await User.countDocuments({ role: 'boutique' })}`);
    console.log(`  - Customers: ${await User.countDocuments({ role: 'customer' })}`);
    console.log(`  - Rental Spaces: ${await RentalSpace.countDocuments()}`);
    console.log(`  - Contracts: ${await Contract.countDocuments()}`);
    console.log(`  - Rent Payments: ${await RentPayment.countDocuments()}`);
    console.log(`  - Products: ${await Product.countDocuments()}`);
    console.log(`  - Sales: ${await Sale.countDocuments()}`);
    console.log(`  - Orders: ${await Order.countDocuments()}`);
    console.log(`  - Menu Items: ${await MenuItem.countDocuments()}`);

    console.log('\n👉 Seeders finished, keeping connection open for server');
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    // Do NOT close the connection - server needs it
    // Connection will be closed when server shuts down
  }
}

module.exports = runAllSeeders;
