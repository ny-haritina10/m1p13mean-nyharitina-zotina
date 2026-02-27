const User = require('../models/User');

class AdminSellerService {
  async getAllSellers(filters = {}) {
    const query = { role: 'boutique' };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    const sellers = await User.find(query).select('-password').sort({ createdAt: -1 });
    return sellers;
  }

  async getSellerById(sellerId) {
    const seller = await User.findOne({ _id: sellerId, role: 'boutique' }).select('-password');
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }
    return seller;
  }

  async approveSeller(sellerId, adminId) {
    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status === 'approved') {
      const error = new Error('Seller is already approved');
      error.statusCode = 400;
      throw error;
    }

    if (seller.status === 'rejected') {
      const error = new Error('Cannot approve a rejected seller. Please reactivate first.');
      error.statusCode = 400;
      throw error;
    }

    seller.status = 'approved';
    seller.approvedAt = new Date();
    seller.approvedBy = adminId;
    
    await seller.save();
    
    return {
      message: 'Seller approved successfully',
      seller: {
        id: seller._id,
        username: seller.username,
        boutiqueName: seller.boutiqueName,
        status: seller.status
      }
    };
  }

  async rejectSeller(sellerId) {
    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status === 'rejected') {
      const error = new Error('Seller is already rejected');
      error.statusCode = 400;
      throw error;
    }

    if (seller.status === 'approved') {
      const error = new Error('Cannot reject an approved seller. Please suspend instead.');
      error.statusCode = 400;
      throw error;
    }

    seller.status = 'rejected';
    await seller.save();
    
    return {
      message: 'Seller rejected successfully',
      seller: {
        id: seller._id,
        username: seller.username,
        boutiqueName: seller.boutiqueName,
        status: seller.status
      }
    };
  }

  async suspendSeller(sellerId) {
    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status !== 'approved') {
      const error = new Error('Can only suspend approved sellers');
      error.statusCode = 400;
      throw error;
    }

    seller.status = 'suspended';
    await seller.save();
    
    return {
      message: 'Seller suspended successfully',
      seller: {
        id: seller._id,
        username: seller.username,
        boutiqueName: seller.boutiqueName,
        status: seller.status
      }
    };
  }

  async reactivateSeller(sellerId) {
    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status === 'approved') {
      const error = new Error('Seller is already active');
      error.statusCode = 400;
      throw error;
    }

    if (seller.status === 'rejected') {
      const error = new Error('Cannot reactivate a rejected seller. Create a new account instead.');
      error.statusCode = 400;
      throw error;
    }

    seller.status = 'approved';
    seller.approvedAt = new Date();
    await seller.save();
    
    return {
      message: 'Seller reactivated successfully',
      seller: {
        id: seller._id,
        username: seller.username,
        boutiqueName: seller.boutiqueName,
        status: seller.status
      }
    };
  }

  async createSeller(data) {
    const { username, password, boutiqueName, phone } = data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const error = new Error('Username already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await User.hashPassword(password);

    const seller = new User({
      username,
      password: hashedPassword,
      role: 'boutique',
      status: 'pending',
      boutiqueName,
      phone
    });

    await seller.save();

    return {
      message: 'Seller created successfully',
      seller: {
        id: seller._id,
        username: seller.username,
        boutiqueName: seller.boutiqueName,
        phone: seller.phone,
        status: seller.status
      }
    };
  }

  async updateSeller(sellerId, data) {
    const { boutiqueName, phone, status } = data;

    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (boutiqueName !== undefined) seller.boutiqueName = boutiqueName;
    if (phone !== undefined) seller.phone = phone;
    if (status !== undefined) {
      if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
        const error = new Error('Invalid status');
        error.statusCode = 400;
        throw error;
      }
      seller.status = status;
    }

    await seller.save();

    return {
      message: 'Seller updated successfully',
      seller: {
        id: seller._id,
        username: seller.username,
        boutiqueName: seller.boutiqueName,
        phone: seller.phone,
        status: seller.status
      }
    };
  }
}

module.exports = new AdminSellerService();
