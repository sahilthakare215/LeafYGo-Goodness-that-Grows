const mongoose = require('mongoose');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leafygo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  {
    title: 'Cold Storage Unit - 2 Ton (Shared Hub)',
    category: 'Infrastructure',
    price: 150000,
    rentPerDay: 3000,
    img: 'https://images.unsplash.com/photo-1600180758891-4ecb9b5b76f1?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    description: 'Modular cold storage for hub use — shared financing option for FPCs',
    tags: ['cold-storage', 'hub', 'infrastructure'],
    availability: true,
    stock: 5
  },
  {
    title: 'Mini Tractor (Utility)',
    category: 'Machines',
    price: 425000,
    rentPerDay: 7000,
    img: 'https://images.unsplash.com/photo-1599999901420-8ee7ce2b8132?auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    description: 'Reliable small tractor suited for small farms and hub logistics',
    tags: ['tractor', 'mechanization'],
    availability: true,
    stock: 3
  },
  {
    title: 'Packaging & Grading Line (Basic)',
    category: 'Machinery',
    price: 65000,
    rentPerDay: 1800,
    img: 'https://images.unsplash.com/photo-1602524818020-7183c4f28f8b?auto=format&fit=crop&w=400&q=80',
    rating: 4.2,
    description: 'Semi-automated grading and packaging machine for hub processing',
    tags: ['packaging', 'quality'],
    availability: true,
    stock: 2
  },
  {
    title: 'Organic Seed Kit — 1 Season (5 varieties)',
    category: 'Inputs',
    price: 2500,
    rentPerDay: 0,
    img: 'https://images.unsplash.com/photo-1601758173927-3d0b382b7e0b?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    description: 'Certified seed pack for cooperative demonstration plots',
    tags: ['seeds', 'organic'],
    availability: true,
    stock: 50
  },
  {
    title: 'Cold-chain Transport (Reefer Van) — Rent',
    category: 'Transport',
    price: 0,
    rentPerDay: 12000,
    img: 'https://images.unsplash.com/photo-1601626127335-5f83d207bfb2?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    description: 'Short-term reefer van rental to move produce between hubs',
    tags: ['transport', 'reefer', 'logistics'],
    availability: true,
    stock: 1
  },
  {
    title: 'Shared Solar Drying Unit (Hub)',
    category: 'Infrastructure',
    price: 45000,
    rentPerDay: 900,
    img: 'https://images.unsplash.com/photo-1616186770050-62c1b0c90d32?auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    description: 'Solar-driven dryer for value-add products and reduced waste',
    tags: ['solar', 'drying'],
    availability: true,
    stock: 4
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Database seeded successfully with products');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();
