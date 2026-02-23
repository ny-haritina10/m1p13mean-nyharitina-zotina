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
  floor: {
    type: Number,
    default: 1
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
  mapPosition: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  width: {
    type: Number,
    default: 60
  },
  height: {
    type: Number,
    default: 40
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

rentalSpaceSchema.index({ floor: 1 });
rentalSpaceSchema.index({ status: 1 });
rentalSpaceSchema.index({ type: 1 });

module.exports = mongoose.model('RentalSpace', rentalSpaceSchema);
