const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leafygo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models
const Product = require('./models/Product');
const CursorPosition = require('./models/CursorPosition');

// Routes

// Get all products with filtering
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Cursor position tracking endpoints

// POST cursor position
app.post('/api/cursor', async (req, res) => {
  try {
    const { userId, x, y, page } = req.body;
    
    if (!userId || x === undefined || y === undefined || !page) {
      return res.status(400).json({ error: 'Missing required fields: userId, x, y, page' });
    }

    const cursorPosition = new CursorPosition({
      userId,
      x,
      y,
      page
    });
    
    await cursorPosition.save();
    res.status(201).json(cursorPosition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET cursor positions by user
app.get('/api/cursor/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const positions = await CursorPosition.find({ userId }).sort({ timestamp: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET cursor positions by page
app.get('/api/cursor/page/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const positions = await CursorPosition.find({ page }).sort({ timestamp: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all cursor positions
app.get('/api/cursor', async (req, res) => {
  try {
    const positions = await CursorPosition.find().sort({ timestamp: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE cursor position
app.delete('/api/cursor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CursorPosition.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Cursor position not found' });
    }
    res.json({ message: 'Cursor position deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
