const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    minlength: 4
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'boutique', 'customer'],
    default: 'customer',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended', 'active', 'blocked'],
    default: function() {
      return this.role === 'boutique' ? 'pending' : 'active';
    },
    index: true
  },
  boutiqueName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  mallLocation: {
    zone: { type: String, trim: true },
    floor: { type: String, trim: true },
    unitNumber: { type: String, trim: true }
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
