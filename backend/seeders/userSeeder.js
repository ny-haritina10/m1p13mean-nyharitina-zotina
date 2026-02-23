const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await User.hashPassword('admin');
    
    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;
