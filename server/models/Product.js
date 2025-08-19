const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Infrastructure', 'Machines', 'Machinery', 'Inputs', 'Transport']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rentPerDay: {
    type: Number,
    default: 0,
    min: 0
  },
  img: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  availability: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
