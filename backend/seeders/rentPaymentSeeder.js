const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Contract = require('../models/Contract');
const RentPayment = require('../models/RentPayment');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');

    const contracts = await Contract.find({ status: 'active' }).populate('seller');
    console.log(`Found ${contracts.length} active contracts`);

    if (contracts.length === 0) {
      console.log('No active contracts found. Please run contractSeeder first.');
      return;
    }

    const currentDate = new Date();
    const monthsToGenerate = [];
    for (let i = 2; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      monthsToGenerate.push({
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
    }

    console.log(`Generating rent payments for months: ${JSON.stringify(monthsToGenerate)}`);

    let paymentsCreated = 0;

    for (const contract of contracts) {
      for (const { month, year } of monthsToGenerate) {
        const existingPayment = await RentPayment.findOne({
          contract: contract._id,
          month: month,
          year: year
        });

        if (existingPayment) {
          console.log(`Rent payment already exists for ${contract.seller?.username} - ${month}/${year}`);
          continue;
        }

        const dueDate = new Date(year, month - 1, 5);
        
        const isPaid = Math.random() > 0.3;
        
        const payment = new RentPayment({
          contract: contract._id,
          seller: contract.seller._id,
          month: month,
          year: year,
          amount: contract.monthlyRent,
          penaltyAmount: 0,
          totalAmount: contract.monthlyRent,
          dueDate: dueDate,
          paidAt: isPaid ? new Date(year, month - 1, Math.floor(Math.random() * 10) + 1) : null,
          status: isPaid ? 'paid' : 'pending'
        });

        await payment.save();
        console.log(`Created rent payment for ${contract.seller?.boutiqueName} - ${month}/${year} (${payment.status})`);
        paymentsCreated++;
      }
    }

    console.log(`\nRent payments seeding completed: ${paymentsCreated} payments created`);

    const pendingCount = await RentPayment.countDocuments({ status: 'pending' });
    const paidCount = await RentPayment.countDocuments({ status: 'paid' });
    console.log(`Pending: ${pendingCount}, Paid: ${paidCount}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}


module.exports = seed;
