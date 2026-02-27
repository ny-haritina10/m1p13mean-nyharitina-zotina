const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nameSnapshot: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPriceSnapshot: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: true });

const sellerOrderSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
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
    required: true,
    index: true
  },
  sellers: [sellerOrderSchema],
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  globalStatus: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
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
  deliveryAddress: {
    street: String,
    city: String,
    phone: String
  },
  customerNotes: String,
  statusHistory: [statusHistorySchema],
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

orderSchema.index({ 'sellers.seller': 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.globalStatus = this.computeGlobalStatus();
  next();
});

orderSchema.methods.computeGlobalStatus = function() {
  if (!this.sellers || this.sellers.length === 0) {
    return 'PENDING';
  }

  const statuses = this.sellers.map(s => s.status);
  const hasCancelled = statuses.includes('CANCELLED');
  const allPending = statuses.every(s => s === 'PENDING');
  const allReady = statuses.every(s => s === 'READY');
  const allCompleted = statuses.every(s => s === 'COMPLETED');
  const anyPreparing = statuses.some(s => s === 'PREPARING' || s === 'CONFIRMED');

  if (allCompleted) return 'COMPLETED';
  if (allReady) return 'READY';
  if (anyPreparing) return 'IN_PROGRESS';
  if (hasCancelled && !anyPreparing) return 'CANCELLED';
  if (allPending) return 'PENDING';
  
  return 'IN_PROGRESS';
};

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

orderSchema.statics.VALID_STATUS_TRANSITIONS = {
  'PENDING': ['CONFIRMED', 'CANCELLED'],
  'CONFIRMED': ['PREPARING', 'CANCELLED'],
  'PREPARING': ['READY'],
  'READY': ['COMPLETED'],
  'COMPLETED': [],
  'CANCELLED': []
};

orderSchema.methods.updateSellerStatus = async function(sellerId, newStatus, userId, notes) {
  const sellerOrder = this.sellers.find(s => s.seller.toString() === sellerId.toString());
  
  if (!sellerOrder) {
    throw new Error('Seller not found in this order');
  }

  const validTransitions = this.constructor.VALID_STATUS_TRANSITIONS;
  if (!validTransitions[sellerOrder.status]?.includes(newStatus)) {
    throw new Error(`Cannot transition from ${sellerOrder.status} to ${newStatus}`);
  }

  sellerOrder.status = newStatus;
  this.globalStatus = this.computeGlobalStatus();
  
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: userId,
    notes: notes || `Status changed to ${newStatus}`
  });

  await this.save();
  return this;
};

module.exports = mongoose.model('Order', orderSchema);
