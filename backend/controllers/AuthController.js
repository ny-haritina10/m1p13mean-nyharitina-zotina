const authService = require('../services/AuthService');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 4 || password.length < 4) {
      return res.status(400).json({ error: 'Username and password must be at least 4 characters' });
    }

    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
