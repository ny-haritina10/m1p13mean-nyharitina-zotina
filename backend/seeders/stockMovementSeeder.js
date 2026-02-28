const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    }

    const seller = await User.findOne({ username: 'vendeur1' });
    if (!seller) {
      console.log('Seller vendeur1 not found.');
      
      
    }
    console.log(`Found seller: ${seller.username}`);

    const products = await Product.find({ seller: seller._id });
    console.log(`Found ${products.length} products`);

    const existingMovements = await StockMovement.countDocuments({ seller: seller._id });
    if (existingMovements > 0) {
      console.log(`Stock movements already exist: ${existingMovements}`);
      
      
    }

    const movementsData = [];
    const now = new Date();

    for (let i = 0; i < 3; i++) {
      const monthsAgo = i;
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.floor(Math.random() * 28) + 1);
      
      for (const product of products.slice(0, 6)) {
        const entryDate = new Date(date);
        entryDate.setDate(entryDate.getDate() + Math.floor(Math.random() * 10));
        
        const entryQuantity = Math.floor(Math.random() * 15) + 5;
        const entryReasons = ['purchase', 'return', 'adjustment'];
        const entryReason = entryReasons[Math.floor(Math.random() * entryReasons.length)];
        
        movementsData.push({
          product: product._id,
          seller: seller._id,
          type: 'entry',
          quantity: entryQuantity,
          reason: entryReason,
          stockAfter: product.stock,
          notes: `Entrée de stock - ${entryReason}`,
          createdAt: entryDate
        });

        const outDate = new Date(entryDate);
        outDate.setDate(outDate.getDate() + Math.floor(Math.random() * 15) + 5);
        
        const outQuantity = Math.floor(Math.random() * 8) + 1;
        const outReasons = ['sale', 'damage', 'loss'];
        const outReason = outReasons[Math.floor(Math.random() * outReasons.length)];
        
        movementsData.push({
          product: product._id,
          seller: seller._id,
          type: 'out',
          quantity: outQuantity,
          reason: outReason,
          stockAfter: Math.max(0, product.stock - outQuantity),
          notes: `Sortie de stock - ${outReason}`,
          createdAt: outDate
        });
      }
    }

    movementsData.sort((a, b) => a.createdAt - b.createdAt);

    for (let i = 0; i < movementsData.length; i++) {
      const movement = movementsData[i];
      
      const product = await Product.findById(movement.product);
      if (product) {
        const movementsBefore = await StockMovement.countDocuments({ 
          product: product._id, 
          createdAt: { $lt: movement.createdAt }
        });
        
        let stockAtTime = product.stock;
        if (movementsBefore > 0) {
          const previousMovements = await StockMovement.find({ 
            product: product._id, 
            createdAt: { $lt: movement.createdAt }
          }).sort({ createdAt: -1 });
          
          if (previousMovements.length > 0) {
            stockAtTime = previousMovements[0].stockAfter;
          }
        }
        
        if (movement.type === 'entry') {
          movement.stockAfter = stockAtTime + movement.quantity;
        } else {
          movement.stockAfter = Math.max(0, stockAtTime - movement.quantity);
        }

        const newMovement = new StockMovement(movement);
        await newMovement.save();
      }
    }

    console.log(`Created ${movementsData.length} stock movements`);

    const entryCount = await StockMovement.countDocuments({ seller: seller._id, type: 'entry' });
    const outCount = await StockMovement.countDocuments({ seller: seller._id, type: 'out' });
    console.log(`Entry: ${entryCount}, Out: ${outCount}`);

    
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    
  }
}


module.exports = seed();
