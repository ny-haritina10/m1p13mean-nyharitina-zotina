const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

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

    const paymentMethods = ['cash', 'mobile_money', 'card'];
    const customerNames = ['Rasoa', 'Mbola', 'Tahiana', 'Fanilo', 'Miaraka', 'Nirina', 'Lala'];

    const now = new Date();
    const dailySales = [];

    for (let day = 0; day < 7; day++) {
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() - day);
      
      const numSales = Math.floor(Math.random() * 4) + 2;
      
      for (let s = 0; s < numSales; s++) {
        saleDate.setHours(Math.floor(Math.random() * 10) + 8);
        saleDate.setMinutes(Math.floor(Math.random() * 60));
        
        const numProducts = Math.floor(Math.random() * 3) + 1;
        const selectedProducts = [];
        let productsTotal = 0;

        for (let j = 0; j < numProducts; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 2) + 1;
          const unitPrice = product.price;
          const subtotal = quantity * unitPrice;
          
          selectedProducts.push({
            product: product._id,
            quantity: quantity,
            unitPrice: unitPrice,
            subtotal: subtotal
          });
          
          productsTotal += subtotal;
        }

        const discount = Math.random() > 0.85 ? 10 : 0;
        const discountAmount = (productsTotal * discount) / 100;
        const totalAmount = productsTotal - discountAmount;

        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        const customerName = Math.random() > 0.3 
          ? customerNames[Math.floor(Math.random() * customerNames.length)] 
          : null;
        const customerPhone = customerName 
          ? `+261 32 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}` 
          : null;

        dailySales.push({
          seller: seller._id,
          products: selectedProducts,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod,
          paymentStatus: 'paid',
          amountPaid: totalAmount,
          customerInfo: customerName ? {
            name: customerName,
            phone: customerPhone
          } : undefined,
          saleDate: new Date(saleDate),
          discount: discount,
          notes: ''
        });
      }
    }

    for (const saleData of dailySales) {
      const sale = new Sale(saleData);
      await sale.save();
    }

    console.log(`Created ${dailySales.length} daily sales for the last 7 days`);

    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const daySales = await Sale.find({
        seller: seller._id,
        saleDate: {
          $gte: new Date(dateStr + 'T00:00:00.000Z'),
          $lte: new Date(dateStr + 'T23:59:59.999Z')
        }
      });
      
      const revenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
      console.log(`${dateStr}: ${daySales.length} sales, ${revenue} Ar`);
    }

    
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    
  }
}


module.exports = seed();
