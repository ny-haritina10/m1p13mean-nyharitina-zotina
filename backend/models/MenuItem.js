const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    enum: ['admin', 'boutique', 'customer']
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

menuItemSchema.index({ roles: 1 });
menuItemSchema.index({ isActive: 1 });
menuItemSchema.index({ order: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
