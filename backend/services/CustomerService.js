const jwt = require('jsonwebtoken');
const User = require('../models/User');

class CustomerService {
  async registerCustomer(data) {
    const { firstName, lastName, email, password } = data;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters');
      error.statusCode = 400;
      throw error;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await User.hashPassword(password);

    const customer = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'customer',
      status: 'active'
    });

    await customer.save();

    const payload = {
      userId: customer._id,
      role: customer.role,
      email: customer.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    return {
      success: true,
      token,
      user: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        role: customer.role
      }
    };
  }

  async loginCustomer(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    if (user.role !== 'customer') {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    if (user.status !== 'active') {
      const error = new Error('Account is not active');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = new CustomerService();
