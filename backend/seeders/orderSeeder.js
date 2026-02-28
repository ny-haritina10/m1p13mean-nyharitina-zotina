const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    console.log('Connected to MongoDB');

    const seller = await User.findOne({ username: 'vendeur1' });
    if (!seller) {
      console.log('Seller vendeur1 not found.');
      await mongoose.disconnect();
      process.exit(0);
    }
    console.log(`Found seller: ${seller.username}`);

    let customers = await User.find({ role: 'customer' });
    
    if (customers.length < 5) {
      const customerData = [
        { username: 'customer1', email: 'rasoa@example.com', firstName: 'Rasoa', lastName: 'Rakoto', phone: '+261 32 11 111 11' },
        { username: 'customer2', email: 'mbola@example.com', firstName: 'Mbola', lastName: 'Ratsimba', phone: '+261 32 22 222 22' },
        { username: 'customer3', email: 'tahiana@example.com', firstName: 'Tahiana', lastName: 'Andria', phone: '+261 32 33 333 33' },
        { username: 'customer4', email: 'fanilo@example.com', firstName: 'Fanilo', lastName: 'Randria', phone: '+261 32 44 444 44' },
        { username: 'customer5', email: 'miaraka@example.com', firstName: 'Miaraka', lastName: 'Rabe', phone: '+261 32 55 555 55' }
      ];

      for (const cData of customerData) {
        const existing = await User.findOne({ username: cData.username });
        if (!existing) {
          const password = await User.hashPassword('password123');
          const customer = new User({
            ...cData,
            password: password,
            role: 'customer',
            status: 'active'
          });
          await customer.save();
          console.log(`Created customer: ${cData.username}`);
        }
      }
      customers = await User.find({ role: 'customer' });
    }
    console.log(`Total customers: ${customers.length}`);

    const products = await Product.find({ seller: seller._id });
    console.log(`Found ${products.length} products`);

    await Order.deleteMany({ 'sellers.seller': seller._id });
    console.log('Cleared existing orders for this seller');

    const paymentMethods = ['cash', 'mobile_money', 'card'];
    const sellerStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
    const globalStatuses = ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'];
    const cities = ['Antananarivo', 'Toamasina', 'Fianarantsoa', 'Mahajanga', 'Antsirabe'];

    const ordersData = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - daysAgo);
      orderDate.setHours(Math.floor(Math.random() * 10) + 8);
      orderDate.setMinutes(Math.floor(Math.random() * 60));

      const customer = customers[Math.floor(Math.random() * customers.length)];
      
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
          seller: seller._id,
          nameSnapshot: product.name,
          quantity: quantity,
          unitPriceSnapshot: unitPrice,
          subtotal: subtotal
        });
        
        productsTotal += subtotal;
      }

      const totalAmount = productsTotal;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentStatus = Math.random() > 0.3 ? 'paid' : 'pending';
      const sellerStatus = sellerStatuses[Math.floor(Math.random() * sellerStatuses.length)];
      const globalStatus = globalStatuses[sellerStatuses.indexOf(sellerStatus)] || 'IN_PROGRESS';

      const order = {
        orderNumber: `CMD-2026-${String(1000 + i).padStart(4, '0')}`,
        customer: customer._id,
        sellers: [{
          seller: seller._id,
          status: sellerStatus,
          subtotal: totalAmount
        }],
        items: selectedProducts,
        totalAmount: totalAmount,
        globalStatus: globalStatus,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        deliveryAddress: {
          street: `${Math.floor(Math.random() * 500) + 1} Rue ${['Andriamanelo', 'Radama', 'Lam Belmont', 'Printemps', 'Pasteur'][Math.floor(Math.random() * 5)]}`,
          city: cities[Math.floor(Math.random() * cities.length)],
          phone: customer.phone
        },
        customerNotes: Math.random() > 0.7 ? 'Merci de m\'appeler avant la livraison' : '',
        statusHistory: [{
          status: sellerStatus,
          changedAt: orderDate,
          notes: 'Commande créée'
        }],
        createdAt: orderDate
      };

      ordersData.push(order);
    }

    for (const orderData of ordersData) {
      const order = new Order(orderData);
      await order.save();
      console.log(`Order created: ${orderData.orderNumber} - ${orderData.globalStatus} - ${orderData.totalAmount} Ar`);
    }

    console.log(`\nCreated ${ordersData.length} orders`);

    const statusCounts = await Order.aggregate([
      { $match: { 'sellers.seller': seller._id } },
      { $unwind: '$sellers' },
      { $match: { 'sellers.seller': seller._id } },
      { $group: { _id: '$sellers.status', count: { $sum: 1 } } }
    ]);
    console.log('Status breakdown:', statusCounts);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
