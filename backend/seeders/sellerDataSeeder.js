const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Boutique = require('../models/Boutique');
const Category = require('../models/Category');
const Product = require('../models/Product');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');

    const seller = await User.findOne({ username: 'vendeur1' });
    if (!seller) {
      console.log('Seller vendeur1 not found. Please run sellerSeeder first.');
      return;
    }
    console.log(`Found seller: ${seller.username} - ${seller.boutiqueName}`);

    let boutique = await Boutique.findOne({ seller: seller._id });
    if (!boutique) {
      boutique = new Boutique({
        seller: seller._id,
        name: 'Mode Élégance',
        description: 'Boutique de vêtements et accessoires de mode pour hommes et femmes. Nous proposons des articles de qualité à des prix abordables.',
        logo: '',
        openingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        location: {
          floor: 1,
          zone: 'Zone A',
          spaceNumber: 'BOX-001'
        },
        phone: '+261 32 12 345 01',
        email: 'vendeur1@test.com',
        status: 'active'
      });
      await boutique.save();
      console.log('Boutique created: Mode Élégance');
    } else {
      console.log('Boutique already exists: ' + boutique.name);
    }

    const existingCategories = await Category.find({ seller: seller._id });
    if (existingCategories.length === 0) {
      const categories = [
        { name: 'Vêtements Hommes', seller: seller._id },
        { name: 'Vêtements Femmes', seller: seller._id },
        { name: 'Accessoires', seller: seller._id },
        { name: 'Chaussures', seller: seller._id }
      ];

      for (const catData of categories) {
        const category = new Category(catData);
        await category.save();
        console.log(`Category created: ${catData.name}`);
      }
      console.log('Categories seeded successfully');
    } else {
      console.log(`Categories already exist: ${existingCategories.length} categories`);
    }

    const categories = await Category.find({ seller: seller._id });
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const existingProducts = await Product.countDocuments({ seller: seller._id });
    if (existingProducts === 0) {
      const products = [
        {
          name: 'Chemise Coton Blanc',
          description: 'Chemise homme en coton bio de haute qualité, coupe regular',
          category: 'Vêtements Hommes',
          price: 45000,
          stock: 25,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Pantalon Chino Beige',
          description: 'Pantalon chino confortable pour homme, couleur beige classique',
          category: 'Vêtements Hommes',
          price: 55000,
          stock: 18,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'T-Shirt Noir Basic',
          description: 'T-shirt en coton, coupe regular, noir',
          category: 'Vêtements Hommes',
          price: 25000,
          stock: 50,
          lowStockThreshold: 10,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
          status: 'active',
          isPromotional: true
        },
        {
          name: 'Robe d\'été Fleurie',
          description: 'Robe légère femme avec imprimé floral, parfaite pour l\'été',
          category: 'Vêtements Femmes',
          price: 65000,
          stock: 15,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Blouse en Soie',
          description: 'Blouse elegante en soie naturelle, plusieurs couleurs disponibles',
          category: 'Vêtements Femmes',
          price: 85000,
          stock: 10,
          lowStockThreshold: 3,
          images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Jean Skinny Bleu',
          description: 'Jean femme skinny fit, élastique et confortable',
          category: 'Vêtements Femmes',
          price: 60000,
          stock: 20,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Ceinture en Cuir',
          description: 'Ceinture hommes en cuir véritable, boucle металл',
          category: 'Accessoires',
          price: 35000,
          stock: 30,
          lowStockThreshold: 8,
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Lunettes de Soleil',
          description: 'Lunettes de soleil style aviator, protection UV400',
          category: 'Accessoires',
          price: 45000,
          stock: 22,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Sac à Dos Urbain',
          description: 'Sac à dos résistant pour usage quotidien, plusieurs compartiments',
          category: 'Accessoires',
          price: 55000,
          stock: 12,
          lowStockThreshold: 3,
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Sneakers Blanc',
          description: 'Sneakers urbains blancs, confortables et élégants',
          category: 'Chaussures',
          price: 75000,
          stock: 15,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Sandales Cuir',
          description: 'Sandales en cuir véritable pour hommes, été',
          category: 'Chaussures',
          price: 45000,
          stock: 20,
          lowStockThreshold: 5,
          images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400'],
          status: 'active',
          isPromotional: false
        },
        {
          name: 'Bottes en Cuir',
          description: 'Bottes en cuir pour hommes, hivernales',
          category: 'Chaussures',
          price: 95000,
          stock: 8,
          lowStockThreshold: 3,
          images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'],
          status: 'active',
          isPromotional: false
        }
      ];

      for (const prodData of products) {
        const product = new Product({
          ...prodData,
          seller: seller._id,
          category: categoryMap[prodData.category] || prodData.category
        });
        await product.save();
        console.log(`Product created: ${prodData.name}`);
      }
      console.log(`Products seeded successfully: ${products.length} products`);
    } else {
      console.log(`Products already exist: ${existingProducts} products`);
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Boutique: ${boutique.name}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Products: ${await Product.countDocuments({ seller: seller._id })}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}


module.exports = seed;
