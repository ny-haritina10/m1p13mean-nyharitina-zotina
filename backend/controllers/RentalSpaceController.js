const rentalSpaceService = require('../services/RentalSpaceService');

exports.createSpace = async (req, res, next) => {
  try {
    const { name, type, location, surface, monthlyPrice } = req.body;

    if (!name || !type || !monthlyPrice) {
      return res.status(400).json({ error: 'Name, type, and monthlyPrice are required' });
    }

    const result = await rentalSpaceService.createSpace({ name, type, location, surface, monthlyPrice });
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getAllSpaces = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const spaces = await rentalSpaceService.getAllSpaces({ status, type });
    res.json(spaces);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getAvailableSpaces = async (req, res, next) => {
  try {
    const spaces = await rentalSpaceService.getAvailableSpaces();
    res.json(spaces);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getSpaceById = async (req, res, next) => {
  try {
    const space = await rentalSpaceService.getSpaceById(req.params.id);
    res.json(space);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.updateSpace = async (req, res, next) => {
  try {
    const { name, type, location, surface, monthlyPrice, status } = req.body;
    const result = await rentalSpaceService.updateSpace(req.params.id, { name, type, location, surface, monthlyPrice, status });
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const result = await rentalSpaceService.changeStatus(req.params.id, status);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
