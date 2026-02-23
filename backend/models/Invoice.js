const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  rentPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentPayment',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  pdfPath: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['generated', 'sent'],
    default: 'generated'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

invoiceSchema.index({ rentPayment: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
