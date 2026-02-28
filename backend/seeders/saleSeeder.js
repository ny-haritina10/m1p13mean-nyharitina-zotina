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

    const existingSales = await Sale.countDocuments({ seller: seller._id });
    if (existingSales > 0) {
      console.log(`Sales already exist: ${existingSales}`);
      
      
    }

    const paymentMethods = ['cash', 'mobile_money', 'card', 'mixed'];
    const paymentStatuses = ['paid', 'paid', 'paid', 'pending', 'partial'];
    const customerNames = ['Rasoa', 'Mbola', 'Tahiana', 'Fanilo', 'Miaraka', null, null, null];
    
    const salesData = [];
    const now = new Date();

    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() - daysAgo);
      saleDate.setHours(Math.floor(Math.random() * 10) + 8);
      saleDate.setMinutes(Math.floor(Math.random() * 60));

      const numProducts = Math.floor(Math.random() * 3) + 1;
      const selectedProducts = [];
      let productsTotal = 0;

      for (let j = 0; j < numProducts; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
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

      const discount = Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 5 : 0;
      const discountAmount = (productsTotal * discount) / 100;
      const totalAmount = productsTotal - discountAmount;

      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      let amountPaid = 0;
      if (paymentStatus === 'paid') {
        amountPaid = totalAmount;
      } else if (paymentStatus === 'partial') {
        amountPaid = Math.floor(totalAmount * (Math.random() * 0.5 + 0.3));
      }

      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const customerPhone = customerName ? `+261 32 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}` : null;

      const notes = [
        'Vente rapide',
        'Client régulier',
        'Promo appliquée',
        'Paiement différé',
        ''
      ][Math.floor(Math.random() * 5)];

      salesData.push({
        seller: seller._id,
        products: selectedProducts,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        amountPaid: amountPaid,
        customerInfo: customerName ? {
          name: customerName,
          phone: customerPhone
        } : undefined,
        saleDate: saleDate,
        discount: discount,
        notes: notes
      });
    }

    salesData.sort((a, b) => a.saleDate - b.saleDate);

    for (const saleData of salesData) {
      const sale = new Sale(saleData);
      await sale.save();
      console.log(`Sale created: ${saleData.products.length} products - ${saleData.totalAmount} Ar - ${saleData.paymentStatus}`);
    }

    console.log(`\nCreated ${salesData.length} sales`);

    const totalRevenue = await Sale.aggregate([
      { $match: { seller: seller._id, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    console.log(`Total revenue (paid): ${totalRevenue[0]?.total || 0} Ar`);

    
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    
  }
}


module.exports = seed();
