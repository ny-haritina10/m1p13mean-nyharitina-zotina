const Product = require('../models/Product');

const PRODUCTS = [
  // Vêtements - 5 products
  {
    name: 'T-shirt Coton Bio Blanc',
    description: 'T-shirt en coton biologique de haute qualité, parfait pour le quotidien',
    category: 'Vêtements',
    price: 25000,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']
  },
  {
    name: 'Jean Slim Fit Bleu',
    description: 'Jean slim fit élastique, confortable et moderne',
    category: 'Vêtements',
    price: 45000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400']
  },
  {
    name: 'Robe Été Fleurie',
    description: 'Robe légère fleurie pour lété, matières respirantes',
    category: 'Vêtements',
    price: 55000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400']
  },
  {
    name: 'Veste en Jean Délavée',
    description: 'Veste en jean style vintage, plusieurs poches',
    category: 'Vêtements',
    price: 65000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400']
  },
  {
    name: 'Sweat à Capuche Gris',
    description: 'Sweat confortable avec capuche, idéal pour lautomne',
    category: 'Vêtements',
    price: 35000,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400']
  },

  // Chaussures - 5 products
  {
    name: 'Sneakers Urban Blanc',
    description: 'Sneakers urbanas légères et confortables',
    category: 'Chaussures',
    price: 75000,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400']
  },
  {
    name: 'Sandales en Cuir Marron',
    description: 'Sandales élégantes en cuir véritable,semelle confortable',
    category: 'Chaussures',
    price: 45000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400']
  },
  {
    name: 'Baskets Sport Noir',
    description: 'Baskets performantes pour le sport et le quotidien',
    category: 'Chaussures',
    price: 85000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400']
  },
  {
    name: 'Chaussures en Toile Vert',
    description: 'Chaussures légères en toile, parfaites pour lété',
    category: 'Chaussures',
    price: 30000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400']
  },
  {
    name: 'Bottes en Cuir Noir',
    description: 'Bottes élégantes en cuir, idéales pour lhiver',
    category: 'Chaussures',
    price: 95000,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400']
  },

  // Électronique - 5 products
  {
    name: 'Casque Audio Sans Fil',
    description: 'Casque bluetooth haute fidélité, autonomie 20h',
    category: 'Électronique',
    price: 125000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400']
  },
  {
    name: 'Montre Connectée Noire',
    description: 'Montre intelligente avec cardio, podomètre et notifications',
    category: 'Électronique',
    price: 150000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400']
  },
  {
    name: 'Enceinte Portable Bluetooth',
    description: 'Enceinte waterproof, son puissant 360°',
    category: 'Électronique',
    price: 55000,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400']
  },
  {
    name: 'Chargeur Rapide USB-C',
    description: 'Chargeur rapide 65W compatible tous appareils',
    category: 'Électronique',
    price: 25000,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400']
  },
  {
    name: 'Support Téléphone Voiture',
    description: 'Support magnétique pour voiture, rotation 360°',
    category: 'Électronique',
    price: 15000,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1617653793985-fb9ff00ccf4b?w=400']
  },

  // Accessoires - 5 products
  {
    name: 'Sac à Dos Urbain',
    description: 'Sac à dos résistant à leau, compartiment laptop',
    category: 'Accessoires',
    price: 45000,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400']
  },
  {
    name: 'Lunettes de Soleil Aviator',
    description: 'Lunettes de soleil style aviator, protection UV400',
    category: 'Accessoires',
    price: 35000,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400']
  },
  {
    name: 'Ceinture en Cuir Noir',
    description: 'Ceinture en cuir véritable, boucle métal',
    category: 'Accessoires',
    price: 20000,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400']
  },
  {
    name: 'Portefeuille Cuir',
    description: 'Portefeuille compact en cuir, plusieurs compartiments',
    category: 'Accessoires',
    price: 28000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400']
  },
  {
    name: 'Écharpe en Soie',
    description: 'Écharpe fluide en soie, plusieurs motifs disponibles',
    category: 'Accessoires',
    price: 38000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400']
  },

  // Cosmétiques - 5 products
  {
    name: 'Crème Hydratante Visage',
    description: 'Crème hydratante jours, formule légère et NON-grasse',
    category: 'Cosmétiques',
    price: 32000,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400']
  },
  {
    name: 'Parfum Femme Fleur dOrange',
    description: 'Eau de parfum 50ml, notes florales fraîche',
    category: 'Cosmétiques',
    price: 85000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400']
  },
  {
    name: 'Shampooing Réparateur',
    description: 'Shampooing adapté pour cheveux secs et endommagés',
    category: 'Cosmétiques',
    price: 18000,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1585232351009-31338186ce39?w=400']
  },
  {
    name: 'Maquillage Teint Naturel',
    description: 'Fond de teint légère, coverage moyenne, effet naturel',
    category: 'Cosmétiques',
    price: 45000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400']
  },
  {
    name: 'Huile Essentielle Lavande',
    description: 'Huiles essentielles 100% pures, plusieurs vertus',
    category: 'Cosmétiques',
    price: 22000,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400']
  }
];

const seedProducts = async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mean_db');
    
    const User = require('../models/User');
    const seller = await User.findOne({ role: 'boutique', status: 'approved' });
    
    if (!seller) {
      console.log('No approved seller found. Please create a seller first.');
      process.exit(1);
    }

    // Clear existing products for this seller
    await Product.deleteMany({ seller: seller._id });
    console.log('Existing products cleared');

    // Create products
    const productsToCreate = PRODUCTS.map(product => ({
      ...product,
      seller: seller._id,
      status: 'active',
      isPromotional: false,
      lowStockThreshold: 5
    }));

    await Product.insertMany(productsToCreate);
    console.log(`${PRODUCTS.length} products seeded successfully`);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
