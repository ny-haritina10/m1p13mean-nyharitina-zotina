const mongoose = require('mongoose');
require('dotenv').config();

async function runAllSeeders() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    console.log('===========================================');
    console.log('🚀 RUNNING ALL SEEDERS');
    console.log('===========================================\n');

    // Run each seeder manually
    console.log('\n📦 Running: User (Admin)...');
    require('./userSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ User (Admin) completed');

    console.log('\n📦 Running: Sellers (5 vendeurs)...');
    require('./sellerSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Sellers completed');

    console.log('\n📦 Running: Rental Spaces...');
    require('./rentalSpaceSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Rental Spaces completed');

    console.log('\n📦 Running: Contracts...');
    require('./contractSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Contracts completed');

    console.log('\n📦 Running: Rent Payments...');
    require('./rentPaymentSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Rent Payments completed');

    console.log('\n📦 Running: Seller Data...');
    require('./sellerDataSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Seller Data completed');

    console.log('\n📦 Running: Stock Movements...');
    require('./stockMovementSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Stock Movements completed');

    console.log('\n📦 Running: Sales...');
    require('./saleSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Sales completed');

    console.log('\n📦 Running: Daily Sales...');
    require('./dailySalesSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Daily Sales completed');

    console.log('\n📦 Running: Orders...');
    require('./orderSeeder.js');
    await new Promise(r => setTimeout(r, 500));
    console.log('✅ Orders completed');

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

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

runAllSeeders();
