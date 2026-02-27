const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceSnapshot: {
    type: Number,
    required: true
  },
  promotionalPriceSnapshot: {
    type: Number,
    default: null
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  sessionId: {
    type: String,
    default: null,
    index: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

cartSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Cart', cartSchema);
