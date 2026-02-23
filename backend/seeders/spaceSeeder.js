const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RentalSpace = require('../models/RentalSpace');

dotenv.config({ path: __dirname + '/../.env' });

const spaces = [
  // Ground Floor (Rez-de-chaussée) - 10 spaces
  { name: 'BOX-001', type: 'box', floor: 0, location: 'Entrée principale', surface: 15, monthlyPrice: 250000, status: 'occupied', mapPosition: { x: 50, y: 50 }, width: 60, height: 40 },
  { name: 'BOX-002', type: 'box', floor: 0, location: 'Entrée principale', surface: 15, monthlyPrice: 250000, status: 'occupied', mapPosition: { x: 120, y: 50 }, width: 60, height: 40 },
  { name: 'BOX-003', type: 'box', floor: 0, location: 'Entrée principale', surface: 20, monthlyPrice: 300000, status: 'available', mapPosition: { x: 190, y: 50 }, width: 60, height: 40 },
  { name: 'KIOSQUE-001', type: 'kiosque', floor: 0, location: 'Atrium central', surface: 8, monthlyPrice: 200000, status: 'occupied', mapPosition: { x: 300, y: 80 }, width: 50, height: 50 },
  { name: 'KIOSQUE-002', type: 'kiosque', floor: 0, location: 'Atrium central', surface: 8, monthlyPrice: 200000, status: 'occupied', mapPosition: { x: 360, y: 80 }, width: 50, height: 50 },
  { name: 'STAND-001', type: 'stand', floor: 0, location: 'Couloir principal', surface: 30, monthlyPrice: 450000, status: 'occupied', mapPosition: { x: 50, y: 150 }, width: 80, height: 50 },
  { name: 'STAND-002', type: 'stand', floor: 0, location: 'Couloir principal', surface: 30, monthlyPrice: 450000, status: 'available', mapPosition: { x: 140, y: 150 }, width: 80, height: 50 },
  { name: 'BOX-004', type: 'box', floor: 0, location: 'Aile gauche', surface: 12, monthlyPrice: 180000, status: 'maintenance', mapPosition: { x: 50, y: 250 }, width: 60, height: 40 },
  { name: 'BOX-005', type: 'box', floor: 0, location: 'Aile gauche', surface: 12, monthlyPrice: 180000, status: 'occupied', mapPosition: { x: 120, y: 250 }, width: 60, height: 40 },
  { name: 'BOX-006', type: 'box', floor: 0, location: 'Aile droite', surface: 18, monthlyPrice: 280000, status: 'occupied', mapPosition: { x: 300, y: 250 }, width: 60, height: 40 },

  // Floor 1 - 12 spaces
  { name: 'BOX-101', type: 'box', floor: 1, location: 'Escalier A', surface: 20, monthlyPrice: 350000, status: 'occupied', mapPosition: { x: 50, y: 50 }, width: 60, height: 40 },
  { name: 'BOX-102', type: 'box', floor: 1, location: 'Escalier A', surface: 20, monthlyPrice: 350000, status: 'occupied', mapPosition: { x: 120, y: 50 }, width: 60, height: 40 },
  { name: 'BOX-103', type: 'box', floor: 1, location: 'Escalier A', surface: 25, monthlyPrice: 400000, status: 'available', mapPosition: { x: 190, y: 50 }, width: 60, height: 40 },
  { name: 'BOX-104', type: 'box', floor: 1, location: 'Escalier B', surface: 15, monthlyPrice: 280000, status: 'occupied', mapPosition: { x: 300, y: 50 }, width: 60, height: 40 },
  { name: 'KIOSQUE-101', type: 'kiosque', floor: 1, location: 'Palier escalier', surface: 6, monthlyPrice: 180000, status: 'occupied', mapPosition: { x: 400, y: 60 }, width: 45, height: 45 },
  { name: 'STAND-101', type: 'stand', floor: 1, location: 'Couloir Est', surface: 40, monthlyPrice: 600000, status: 'occupied', mapPosition: { x: 50, y: 150 }, width: 100, height: 60 },
  { name: 'STAND-102', type: 'stand', floor: 1, location: 'Couloir Est', surface: 35, monthlyPrice: 550000, status: 'available', mapPosition: { x: 160, y: 150 }, width: 90, height: 55 },
  { name: 'BOX-105', type: 'box', floor: 1, location: 'Aile Nord', surface: 22, monthlyPrice: 380000, status: 'occupied', mapPosition: { x: 50, y: 250 }, width: 65, height: 45 },
  { name: 'BOX-106', type: 'box', floor: 1, location: 'Aile Nord', surface: 22, monthlyPrice: 380000, status: 'maintenance', mapPosition: { x: 125, y: 250 }, width: 65, height: 45 },
  { name: 'KIOSQUE-102', type: 'kiosque', floor: 1, location: 'Zone restauration', surface: 10, monthlyPrice: 250000, status: 'occupied', mapPosition: { x: 280, y: 260 }, width: 55, height: 50 },
  { name: 'BOX-107', type: 'box', floor: 1, location: 'Aile Sud', surface: 18, monthlyPrice: 320000, status: 'available', mapPosition: { x: 380, y: 250 }, width: 60, height: 40 },
  { name: 'STAND-103', type: 'stand', floor: 1, location: 'Fond couloir', surface: 50, monthlyPrice: 750000, status: 'occupied', mapPosition: { x: 450, y: 150 }, width: 80, height: 60 },

  // Floor 2 - 8 spaces
  { name: 'BOX-201', type: 'box', floor: 2, location: 'Zone premium', surface: 25, monthlyPrice: 450000, status: 'occupied', mapPosition: { x: 80, y: 80 }, width: 70, height: 45 },
  { name: 'BOX-202', type: 'box', floor: 2, location: 'Zone premium', surface: 25, monthlyPrice: 450000, status: 'available', mapPosition: { x: 160, y: 80 }, width: 70, height: 45 },
  { name: 'BOX-203', type: 'box', floor: 2, location: 'Zone premium', surface: 30, monthlyPrice: 500000, status: 'occupied', mapPosition: { x: 240, y: 80 }, width: 70, height: 45 },
  { name: 'KIOSQUE-201', type: 'kiosque', floor: 2, location: 'Terrasse', surface: 12, monthlyPrice: 350000, status: 'occupied', mapPosition: { x: 350, y: 100 }, width: 60, height: 55 },
  { name: 'STAND-201', type: 'stand', floor: 2, location: 'Espace centrale', surface: 60, monthlyPrice: 900000, status: 'occupied', mapPosition: { x: 80, y: 200 }, width: 120, height: 70 },
  { name: 'STAND-202', type: 'stand', floor: 2, location: 'Espace centrale', surface: 45, monthlyPrice: 700000, status: 'available', mapPosition: { x: 220, y: 200 }, width: 100, height: 60 },
  { name: 'BOX-204', type: 'box', floor: 2, location: 'Angle Nord-Est', surface: 35, monthlyPrice: 550000, status: 'occupied', mapPosition: { x: 380, y: 200 }, width: 65, height: 45 },
  { name: 'KIOSQUE-202', type: 'kiosque', floor: 2, location: 'Vue panoramique', surface: 15, monthlyPrice: 400000, status: 'maintenance', mapPosition: { x: 450, y: 280 }, width: 55, height: 50 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    console.log('Connected to MongoDB');

    await RentalSpace.deleteMany({});
    console.log('Cleared existing spaces');

    await RentalSpace.insertMany(spaces);
    console.log(`Seeded ${spaces.length} spaces`);

    const floor0 = await RentalSpace.countDocuments({ floor: 0 });
    const floor1 = await RentalSpace.countDocuments({ floor: 1 });
    const floor2 = await RentalSpace.countDocuments({ floor: 2 });
    const occupied = await RentalSpace.countDocuments({ status: 'occupied' });
    const available = await RentalSpace.countDocuments({ status: 'available' });
    const maintenance = await RentalSpace.countDocuments({ status: 'maintenance' });

    console.log('\nSummary:');
    console.log(`  Ground Floor: ${floor0} spaces`);
    console.log(`  Floor 1: ${floor1} spaces`);
    console.log(`  Floor 2: ${floor2} spaces`);
    console.log(`  Occupied: ${occupied}`);
    console.log(`  Available: ${available}`);
    console.log(`  Maintenance: ${maintenance}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
