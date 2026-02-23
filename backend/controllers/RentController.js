const rentService = require('../services/RentService');

exports.generateRent = async (req, res, next) => {
  try {
    const { contractId, month, year } = req.body;

    if (!contractId || !month || !year) {
      return res.status(400).json({ error: 'contractId, month, and year are required' });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    const result = await rentService.generateMonthlyRent(contractId, month, year);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getAllRents = async (req, res, next) => {
  try {
    const { status, month, year, sellerId } = req.query;
    const rents = await rentService.getRents({ status, month, year: year ? parseInt(year) : undefined, sellerId });
    res.json(rents);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getRentById = async (req, res, next) => {
  try {
    const rent = await rentService.getRentById(req.params.id);
    res.json(rent);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.markAsPaid = async (req, res, next) => {
  try {
    const result = await rentService.markAsPaid(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.checkLatePayments = async (req, res, next) => {
  try {
    const result = await rentService.checkLatePayments();
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await rentService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getSellerRents = async (req, res, next) => {
  try {
    const rents = await rentService.getSellerRentHistory(req.user.userId);
    res.json(rents);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
