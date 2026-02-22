const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    if (user.status === 'suspended') {
      const error = new Error('Account is suspended');
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
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
