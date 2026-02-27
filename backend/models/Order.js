const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  products: {
    type: [orderItemSchema],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    phone: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'validated', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money', 'card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  validatedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  statusHistory: [statusHistorySchema],
  internalNotes: String,
  customerNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
orderSchema.index({ seller: 1, orderStatus: 1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });

// Update timestamp on save
orderSchema.pre('save', async function() {
  this.updatedAt = new Date();
});

// Static method to generate order number
orderSchema.statics.generateOrderNumber = async function() {
  const date = new Date();
  const prefix = `CMD-${date.getFullYear()}`;
  
  const lastOrder = await this.findOne({ orderNumber: new RegExp(`^${prefix}-`) })
    .sort({ orderNumber: -1 });
  
  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const match = lastOrder.orderNumber.match(/-(\d+)$/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }
  
  return `${prefix}-${String(sequence).padStart(4, '0')}`;
};

// Method to update status
orderSchema.methods.updateStatus = async function(status, userId, notes) {
  const validTransitions = {
    'pending': ['validated', 'cancelled'],
    'validated': ['preparing', 'cancelled'],
    'preparing': ['ready'],
    'ready': ['delivered'],
    'delivered': [],
    'cancelled': []
  };

  if (!validTransitions[this.orderStatus]?.includes(status)) {
    throw new Error(`Cannot transition from ${this.orderStatus} to ${status}`);
  }

  const now = new Date();
  this.orderStatus = status;
  
  // Update timestamp fields
  switch(status) {
    case 'validated':
      this.validatedAt = now;
      break;
    case 'preparing':
      this.preparingAt = now;
      break;
    case 'ready':
      this.readyAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      break;
    case 'cancelled':
      this.cancelledAt = now;
      break;
  }

  // Add to status history
  this.statusHistory.push({
    status,
    changedAt: now,
    changedBy: userId,
    notes
  });

  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
