const spaceAvailabilityService = require('../services/SpaceAvailabilityService');

exports.getAvailability = async (req, res, next) => {
  try {
    const summary = await spaceAvailabilityService.getAvailabilitySummary();
    res.json(summary);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getSpacesByStatus = async (req, res, next) => {
  try {
    const data = await spaceAvailabilityService.getSpacesByStatus();
    res.json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.setMaintenance = async (req, res, next) => {
  try {
    const result = await spaceAvailabilityService.setMaintenance(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.removeMaintenance = async (req, res, next) => {
  try {
    const result = await spaceAvailabilityService.removeMaintenance(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.syncStatus = async (req, res, next) => {
  try {
    const result = await spaceAvailabilityService.syncSpaceStatus();
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
