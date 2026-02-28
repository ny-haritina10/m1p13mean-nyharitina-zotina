const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Contract = require('../models/Contract');
const RentalSpace = require('../models/RentalSpace');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    }

    const sellers = await User.find({ role: 'boutique' });
    console.log(`Found ${sellers.length} sellers`);

    if (sellers.length === 0) {
      console.log('No sellers found. Please run sellerSeeder first.');
      
      
    }

    let rentalSpaces = await RentalSpace.find({ status: 'available' });
    
    if (rentalSpaces.length < sellers.length) {
      console.log('Creating additional rental spaces...');
      const spaceTypes = ['box', 'kiosque', 'stand'];
      const locations = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
      
      for (let i = rentalSpaces.length; i < sellers.length; i++) {
        const newSpace = new RentalSpace({
          name: `Espace ${i + 1}`,
          type: spaceTypes[i % 3],
          location: locations[i % 4],
          floor: Math.floor(i / 4) + 1,
          surface: 20 + (i * 5),
          monthlyPrice: 500000 + (i * 100000),
          status: 'available'
        });
        await newSpace.save();
        rentalSpaces.push(newSpace);
      }
      console.log(`Created ${sellers.length - rentalSpaces.length + 1} rental spaces`);
    }

    rentalSpaces = await RentalSpace.find({ status: 'available' });

    let contractsCreated = 0;

    for (let i = 0; i < sellers.length; i++) {
      const seller = sellers[i];
      const existingContract = await Contract.findOne({ seller: seller._id });
      
      if (existingContract) {
        console.log(`Contract already exists for ${seller.username}`);
        continue;
      }

      const space = rentalSpaces[i % rentalSpaces.length];
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);

      const contract = new Contract({
        seller: seller._id,
        rentalSpace: space._id,
        startDate: startDate,
        endDate: endDate,
        monthlyRent: space.monthlyPrice,
        depositAmount: space.monthlyPrice * 2,
        status: 'active',
        paymentStatus: 'paid'
      });

      await contract.save();
      
      space.status = 'occupied';
      await space.save();

      console.log(`Contract created for ${seller.username} - ${seller.boutiqueName}`);
      contractsCreated++;
    }

    console.log(`Contracts seeding completed: ${contractsCreated} contracts created`);

    
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    
  }
}


module.exports = seed();
