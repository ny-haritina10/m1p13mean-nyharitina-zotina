const adminSellerService = require('../services/AdminSellerService');

exports.getAllSellers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const sellers = await adminSellerService.getAllSellers({ status });
    res.json(sellers);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getSellerById = async (req, res, next) => {
  try {
    const seller = await adminSellerService.getSellerById(req.params.id);
    res.json(seller);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.approveSeller = async (req, res, next) => {
  try {
    const result = await adminSellerService.approveSeller(req.params.id, req.user.userId);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.rejectSeller = async (req, res, next) => {
  try {
    const result = await adminSellerService.rejectSeller(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.suspendSeller = async (req, res, next) => {
  try {
    const result = await adminSellerService.suspendSeller(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.reactivateSeller = async (req, res, next) => {
  try {
    const result = await adminSellerService.reactivateSeller(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
