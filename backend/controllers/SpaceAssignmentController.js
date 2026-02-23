const spaceAssignmentService = require('../services/SpaceAssignmentService');

exports.assignSpace = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const result = await spaceAssignmentService.assignSpace(req.body, adminId);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.reassignSpace = async (req, res, next) => {
  try {
    const adminId = req.user.userId;
    const result = await spaceAssignmentService.reassignSpace(
      req.params.contractId,
      req.body.spaceId,
      req.body,
      adminId
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getAvailableSpaces = async (req, res, next) => {
  try {
    const spaces = await spaceAssignmentService.getAvailableSpacesForAssignment();
    res.json(spaces);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getApprovedSellers = async (req, res, next) => {
  try {
    const sellers = await spaceAssignmentService.getApprovedSellers();
    res.json(sellers);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
