const contractService = require('../services/ContractService');

exports.createContract = async (req, res, next) => {
  try {
    const { sellerId, rentalSpaceId, startDate, endDate, monthlyRent, depositAmount } = req.body;

    if (!sellerId || !rentalSpaceId || !startDate || !endDate || !monthlyRent) {
      return res.status(400).json({ error: 'sellerId, rentalSpaceId, startDate, endDate, and monthlyRent are required' });
    }

    const result = await contractService.createContract(
      { sellerId, rentalSpaceId, startDate, endDate, monthlyRent, depositAmount },
      req.user.userId
    );
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getAllContracts = async (req, res, next) => {
  try {
    const { status, sellerId } = req.query;
    const contracts = await contractService.getAllContracts({ status, sellerId });
    res.json(contracts);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getContractById = async (req, res, next) => {
  try {
    const contract = await contractService.getContractById(req.params.id);
    res.json(contract);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getSellerContracts = async (req, res, next) => {
  try {
    const contracts = await contractService.getSellerContracts(req.params.sellerId);
    res.json(contracts);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.terminateContract = async (req, res, next) => {
  try {
    const result = await contractService.terminateContract(req.params.id);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.checkAndExpireContracts = async (req, res, next) => {
  try {
    const result = await contractService.checkAndExpireContracts();
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
