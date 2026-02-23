const mongoose = require('mongoose');

const rentPaymentSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  penaltyAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'late'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

rentPaymentSchema.index({ contract: 1, month: 1, year: 1 }, { unique: true });
rentPaymentSchema.index({ status: 1 });
rentPaymentSchema.index({ seller: 1, year: 1 });
rentPaymentSchema.index({ dueDate: 1 });

module.exports = mongoose.model('RentPayment', rentPaymentSchema);
