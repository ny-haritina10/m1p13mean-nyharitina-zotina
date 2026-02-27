const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    index: true
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  images: {
    type: [String],
    default: [],
    max: 5
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active',
    index: true
  },
  isPromotional: {
    type: Boolean,
    default: false
  },
  promotionalPrice: {
    type: Number,
    min: 0
  },
  promotionalStartDate: {
    type: Date
  },
  promotionalEndDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update status based on stock before saving
productSchema.pre('save', async function() {
  this.updatedAt = Date.now();

  if (this.stock === 0) {
    this.status = 'out_of_stock';
  } else if (this.stock > 0 && this.status === 'out_of_stock') {
    this.status = 'active';
  }

  // Handle promotional status
  if (this.isPromotional && this.promotionalEndDate) {
    if (new Date() > this.promotionalEndDate) {
      this.isPromotional = false;
      this.promotionalPrice = undefined;
    }
  }
});

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
