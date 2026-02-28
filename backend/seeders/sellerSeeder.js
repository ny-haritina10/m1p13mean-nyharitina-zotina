const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const seedSellers = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    }

    const existingSellers = await User.find({ role: 'boutique' });
    
    if (existingSellers.length >= 5) {
      console.log('5 or more sellers already exist');
      return;
    }

    const sellers = [
      {
        username: 'vendeur1',
        email: 'vendeur1@test.com',
        password: await User.hashPassword('password123'),
        role: 'boutique',
        status: 'approved',
        boutiqueName: 'Mode Élégance',
        phone: '+261 32 12 345 01'
      },
      {
        username: 'vendeur2',
        email: 'vendeur2@test.com',
        password: await User.hashPassword('password123'),
        role: 'boutique',
        status: 'approved',
        boutiqueName: 'Tech Store',
        phone: '+261 32 12 345 02'
      },
      {
        username: 'vendeur3',
        email: 'vendeur3@test.com',
        password: await User.hashPassword('password123'),
        role: 'boutique',
        status: 'approved',
        boutiqueName: 'Casa Comfort',
        phone: '+261 32 12 345 03'
      },
      {
        username: 'vendeur4',
        email: 'vendeur4@test.com',
        password: await User.hashPassword('password123'),
        role: 'boutique',
        status: 'approved',
        boutiqueName: 'Beauté Naturelle',
        phone: '+261 32 12 345 04'
      },
      {
        username: 'vendeur5',
        email: 'vendeur5@test.com',
        password: await User.hashPassword('password123'),
        role: 'boutique',
        status: 'approved',
        boutiqueName: 'Accessoires Premium',
        phone: '+261 32 12 345 05'
      }
    ];

    for (const sellerData of sellers) {
      const existingSeller = await User.findOne({ username: sellerData.username });
      if (!existingSeller) {
        const seller = new User(sellerData);
        await seller.save();
        console.log(`Seller created: ${sellerData.username} - ${sellerData.boutiqueName}`);
      } else {
        console.log(`Seller already exists: ${sellerData.username}`);
      }
    }

    console.log('Seller seeding completed');
  } catch (error) {
    console.error('Error seeding sellers:', error.message);
  }
};

module.exports = seedSellers;
