const mallMapService = require('../services/MallMapService');

exports.getMapData = async (req, res, next) => {
  try {
    const { floor } = req.query;
    const spaces = await mallMapService.getMapData(floor);
    res.json(spaces);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getSpaceDetails = async (req, res, next) => {
  try {
    const space = await mallMapService.getSpaceDetails(req.params.id);
    res.json(space);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.updateMapPosition = async (req, res, next) => {
  try {
    const { x, y, width, height } = req.body;
    const result = await mallMapService.updateMapPosition(req.params.id, { x, y, width, height });
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getFloors = async (req, res, next) => {
  try {
    const floors = await mallMapService.getFloors();
    res.json(floors);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
