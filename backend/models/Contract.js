const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rentalSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalSpace',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  depositAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'late'],
    default: 'unpaid'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  terminatedAt: {
    type: Date
  }
});

contractSchema.index({ seller: 1 });
contractSchema.index({ rentalSpace: 1 });
contractSchema.index({ status: 1 });

module.exports = mongoose.model('Contract', contractSchema);
