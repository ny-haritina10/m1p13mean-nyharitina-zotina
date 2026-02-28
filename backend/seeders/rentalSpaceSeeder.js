const mongoose = require('mongoose');
require('dotenv').config();

const RentalSpace = require('../models/RentalSpace');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    console.log('Connected to MongoDB');

    const existingCount = await RentalSpace.countDocuments();
    console.log(`Existing rental spaces: ${existingCount}`);

    const newSpaces = [
      {
        name: 'BOX-205',
        type: 'box',
        location: 'Zone commerciale',
        floor: 2,
        surface: 28,
        monthlyPrice: 480000,
        status: 'available',
        mapPosition: { x: 100, y: 300 },
        width: 65,
        height: 45
      },
      {
        name: 'BOX-206',
        type: 'box',
        location: 'Zone commerciale',
        floor: 2,
        surface: 32,
        monthlyPrice: 520000,
        status: 'available',
        mapPosition: { x: 180, y: 300 },
        width: 70,
        height: 45
      },
      {
        name: 'KIOSQUE-203',
        type: 'kiosque',
        location: 'Entrée secondaire',
        floor: 0,
        surface: 10,
        monthlyPrice: 280000,
        status: 'available',
        mapPosition: { x: 450, y: 80 },
        width: 50,
        height: 50
      },
      {
        name: 'KIOSQUE-204',
        type: 'kiosque',
        location: 'Hall电梯',
        floor: 1,
        surface: 8,
        monthlyPrice: 220000,
        status: 'available',
        mapPosition: { x: 480, y: 60 },
        width: 45,
        height: 45
      },
      {
        name: 'STAND-203',
        type: 'stand',
        location: 'Espace événements',
        floor: 2,
        surface: 55,
        monthlyPrice: 850000,
        status: 'available',
        mapPosition: { x: 320, y: 200 },
        width: 100,
        height: 65
      },
      {
        name: 'BOX-207',
        type: 'box',
        location: 'Aile Est',
        floor: 1,
        surface: 20,
        monthlyPrice: 360000,
        status: 'available',
        mapPosition: { x: 200, y: 250 },
        width: 60,
        height: 40
      },
      {
        name: 'BOX-208',
        type: 'box',
        location: 'Aile Ouest',
        floor: 0,
        surface: 18,
        monthlyPrice: 300000,
        status: 'available',
        mapPosition: { x: 200, y: 350 },
        width: 60,
        height: 40
      },
      {
        name: 'STAND-204',
        type: 'stand',
        location: 'Promenade',
        floor: 1,
        surface: 42,
        monthlyPrice: 680000,
        status: 'available',
        mapPosition: { x: 270, y: 150 },
        width: 95,
        height: 55
      }
    ];

    let created = 0;
    for (const spaceData of newSpaces) {
      const existingSpace = await RentalSpace.findOne({ name: spaceData.name });
      if (!existingSpace) {
        const space = new RentalSpace(spaceData);
        await space.save();
        console.log(`Created: ${spaceData.name} - ${spaceData.type} - ${spaceData.location}`);
        created++;
      } else {
        console.log(`Already exists: ${spaceData.name}`);
      }
    }

    console.log(`\nRental spaces seeding completed: ${created} new spaces created`);

    const availableCount = await RentalSpace.countDocuments({ status: 'available' });
    console.log(`Total available spaces: ${availableCount}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
