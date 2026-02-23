const mongoose = require('mongoose');

const rentalSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['box', 'kiosque', 'stand'],
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  surface: {
    type: Number,
    min: 0
  },
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

rentalSpaceSchema.index({ status: 1 });

module.exports = mongoose.model('RentalSpace', rentalSpaceSchema);
