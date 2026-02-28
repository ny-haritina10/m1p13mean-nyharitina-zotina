const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const PRODUCTS = [
  { name: 'T-shirt Coton Bio Blanc', description: 'T-shirt en coton biologique', category: 'Vêtements', price: 25000, stock: 50, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'] },
  { name: 'Jean Slim Fit Bleu', description: 'Jean slim fit élastique', category: 'Vêtements', price: 45000, stock: 30, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'] },
  { name: 'Robe Été Fleurie', description: 'Robe légère fleurie', category: 'Vêtements', price: 55000, stock: 25, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'] },
  { name: 'Veste en Jean Délavée', description: 'Veste en jean vintage', category: 'Vêtements', price: 65000, stock: 20, images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400'] },
  { name: 'Sweat à Capuche Gris', description: 'Sweat confortable', category: 'Vêtements', price: 35000, stock: 40, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'] },
  { name: 'Sneakers Urban Blanc', description: 'Sneakers urbanas', category: 'Chaussures', price: 75000, stock: 35, images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'] },
  { name: 'Sandales en Cuir Marron', description: 'Sandales élégantes', category: 'Chaussures', price: 45000, stock: 20, images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400'] },
  { name: 'Baskets Sport Noir', description: 'Baskets performantes', category: 'Chaussures', price: 85000, stock: 25, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'] },
  { name: 'Chaussures en Toile Vert', description: 'Chaussures légères', category: 'Chaussures', price: 30000, stock: 30, images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'] },
  { name: 'Bottes en Cuir Noir', description: 'Bottes élégantes', category: 'Chaussures', price: 95000, stock: 15, images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'] },
  { name: 'Casque Audio Sans Fil', description: 'Casque bluetooth', category: 'Électronique', price: 125000, stock: 30, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'] },
  { name: 'Montre Connectée Noire', description: 'Montre intelligente', category: 'Électronique', price: 150000, stock: 20, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'] },
  { name: 'Enceinte Portable Bluetooth', description: 'Enceinte waterproof', category: 'Électronique', price: 55000, stock: 40, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'] },
  { name: 'Chargeur Rapide USB-C', description: 'Chargeur rapide 65W', category: 'Électronique', price: 25000, stock: 50, images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'] },
  { name: 'Support Téléphone Voiture', description: 'Support magnétique', category: 'Électronique', price: 15000, stock: 60, images: ['https://images.unsplash.com/photo-1617653793985-fb9ff00ccf4b?w=400'] },
  { name: 'Sac à Dos Urbain', description: 'Sac à dos résistant', category: 'Accessoires', price: 45000, stock: 35, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'] },
  { name: 'Lunettes de Soleil Aviator', description: 'Lunettes style aviator', category: 'Accessoires', price: 35000, stock: 40, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'] },
  { name: 'Ceinture en Cuir Noir', description: 'Ceinture en cuir', category: 'Accessoires', price: 20000, stock: 45, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'] },
  { name: 'Portefeuille Cuir', description: 'Portefeuille compact', category: 'Accessoires', price: 28000, stock: 30, images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'] },
  { name: 'Écharpe en Soie', description: 'Écharpe fluide', category: 'Accessoires', price: 38000, stock: 25, images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400'] },
  { name: 'Crème Hydratante Visage', description: 'Crème hydratante', category: 'Cosmétiques', price: 32000, stock: 50, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'] },
  { name: 'Parfum Femme Fleur dOrange', description: 'Eau de parfum', category: 'Cosmétiques', price: 85000, stock: 20, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'] },
  { name: 'Shampooing Réparateur', description: 'Shampooing réparateur', category: 'Cosmétiques', price: 18000, stock: 60, images: ['https://images.unsplash.com/photo-1585232351009-31338186ce39?w=400'] },
  { name: 'Maquillage Teint Naturel', description: 'Fond de teint', category: 'Cosmétiques', price: 45000, stock: 30, images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'] },
  { name: 'Huile Essentielle Lavande', description: 'Huiles essentielles', category: 'Cosmétiques', price: 22000, stock: 40, images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    console.log('Connected to MongoDB');

    let seller = await User.findOne({ role: 'boutique', status: 'approved' });
    
    if (!seller) {
      console.log('No approved seller found. Creating one...');
      const hashedPassword = await User.hashPassword('boutique123');
      seller = new User({
        username: 'boutique1',
        email: 'boutique1@test.com',
        password: hashedPassword,
        role: 'boutique',
        status: 'approved'
      });
      await seller.save();
      console.log('Seller created: boutique1');
    } else {
      console.log('Found seller: ' + seller.username);
    }

    await Product.deleteMany({ seller: seller._id });
    console.log('Existing products cleared');

    const productsToCreate = PRODUCTS.map(product => ({
      ...product,
      seller: seller._id,
      status: 'active',
      isPromotional: false,
      lowStockThreshold: 5
    }));

    await Product.insertMany(productsToCreate);
    console.log(PRODUCTS.length + ' products seeded successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
