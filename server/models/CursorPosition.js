const mongoose = require('mongoose');

const cursorPositionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  x: {
    type: Number,
    required: true,
    min: 0
  },
  y: {
    type: Number,
    required: true,
    min: 0
  },
  page: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto-delete after 5 minutes
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
cursorPositionSchema.index({ userId: 1, page: 1 });

module.exports = mongoose.model('CursorPosition', cursorPositionSchema);
