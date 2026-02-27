const mongoose = require('mongoose');

const saleProductSchema = new mongoose.Schema({
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

const saleSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  products: {
    type: [saleProductSchema],
    required: true,
    validate: {
      validator: function(products) {
        return products && products.length > 0;
      },
      message: 'At least one product is required'
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money', 'card', 'mixed'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'paid'
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },
  saleDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  isPromotional: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
saleSchema.index({ seller: 1, saleDate: -1 });
saleSchema.index({ seller: 1, paymentStatus: 1 });
saleSchema.index({ saleDate: 1 });

// Pre-save validation
saleSchema.pre('save', async function() {
  // Calculate total from products
  const productsTotal = this.products.reduce((sum, p) => sum + p.subtotal, 0);

  // Apply discount
  const discountAmount = (productsTotal * this.discount) / 100;
  const calculatedTotal = productsTotal - discountAmount;

  // Validate totalAmount
  if (Math.abs(this.totalAmount - calculatedTotal) > 1) {
    throw new Error('Total amount does not match products total minus discount');
  }

  // Validate payment
  if (this.paymentStatus === 'paid' && Math.abs(this.amountPaid - this.totalAmount) > 1) {
    throw new Error('Amount paid must equal total amount for paid status');
  }
});

module.exports = mongoose.model('Sale', saleSchema);
