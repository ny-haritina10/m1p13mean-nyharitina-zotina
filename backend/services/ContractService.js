const Contract = require('../models/Contract');
const RentalSpace = require('../models/RentalSpace');
const User = require('../models/User');

class ContractService {
  async createContract(data, adminId) {
    const { sellerId, rentalSpaceId, startDate, endDate, monthlyRent, depositAmount } = data;

    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status !== 'approved') {
      const error = new Error('Seller must be approved to create a contract');
      error.statusCode = 400;
      throw error;
    }

    const rentalSpace = await RentalSpace.findById(rentalSpaceId);
    if (!rentalSpace) {
      const error = new Error('Rental space not found');
      error.statusCode = 404;
      throw error;
    }

    if (rentalSpace.status !== 'available') {
      const error = new Error('Rental space is not available');
      error.statusCode = 400;
      throw error;
    }

    const existingActiveContract = await Contract.findOne({
      seller: sellerId,
      status: 'active'
    });
    if (existingActiveContract) {
      const error = new Error('Seller already has an active contract');
      error.statusCode = 400;
      throw error;
    }

    const existingSpaceContract = await Contract.findOne({
      rentalSpace: rentalSpaceId,
      status: 'active'
    });
    if (existingSpaceContract) {
      const error = new Error('Rental space already has an active contract');
      error.statusCode = 400;
      throw error;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      const error = new Error('End date must be after start date');
      error.statusCode = 400;
      throw error;
    }

    const contract = new Contract({
      seller: sellerId,
      rentalSpace: rentalSpaceId,
      startDate: start,
      endDate: end,
      monthlyRent,
      depositAmount: depositAmount || 0,
      createdBy: adminId,
      status: 'active'
    });

    await contract.save();

    rentalSpace.status = 'occupied';
    await rentalSpace.save();

    return {
      message: 'Contract created successfully',
      contract: {
        id: contract._id,
        seller: seller.boutiqueName || seller.username,
        rentalSpace: rentalSpace.name,
        startDate: contract.startDate,
        endDate: contract.endDate,
        monthlyRent: contract.monthlyRent,
        status: contract.status
      }
    };
  }

  async getAllContracts(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.sellerId) {
      query.seller = filters.sellerId;
    }

    const contracts = await Contract.find(query)
      .populate('seller', 'username boutiqueName')
      .populate('rentalSpace', 'name type location')
      .sort({ createdAt: -1 });

    return contracts;
  }

  async getContractById(contractId) {
    const contract = await Contract.findById(contractId)
      .populate('seller', 'username boutiqueName phone')
      .populate('rentalSpace', 'name type location surface monthlyPrice')
      .populate('createdBy', 'username');

    if (!contract) {
      const error = new Error('Contract not found');
      error.statusCode = 404;
      throw error;
    }

    return contract;
  }

  async getSellerContracts(sellerId) {
    const contracts = await Contract.find({ seller: sellerId })
      .populate('rentalSpace', 'name type location')
      .sort({ createdAt: -1 });

    return contracts;
  }

  async terminateContract(contractId) {
    const contract = await Contract.findById(contractId);
    if (!contract) {
      const error = new Error('Contract not found');
      error.statusCode = 404;
      throw error;
    }

    if (contract.status !== 'active') {
      const error = new Error('Can only terminate active contracts');
      error.statusCode = 400;
      throw error;
    }

    contract.status = 'terminated';
    contract.terminatedAt = new Date();
    await contract.save();

    const rentalSpace = await RentalSpace.findById(contract.rentalSpace);
    if (rentalSpace) {
      rentalSpace.status = 'available';
      await rentalSpace.save();
    }

    return {
      message: 'Contract terminated successfully',
      contract: {
        id: contract._id,
        status: contract.status,
        terminatedAt: contract.terminatedAt
      }
    };
  }

  async checkAndExpireContracts() {
    const today = new Date();
    
    const expiredContracts = await Contract.find({
      status: 'active',
      endDate: { $lt: today }
    });

    for (const contract of expiredContracts) {
      contract.status = 'expired';
      await contract.save();

      const rentalSpace = await RentalSpace.findById(contract.rentalSpace);
      if (rentalSpace && rentalSpace.status === 'occupied') {
        rentalSpace.status = 'available';
        await rentalSpace.save();
      }
    }

    return {
      message: `Expired ${expiredContracts.length} contracts`,
      expiredCount: expiredContracts.length
    };
  }

  async checkSellerActiveContract(sellerId) {
    const activeContract = await Contract.findOne({
      seller: sellerId,
      status: 'active'
    }).populate('rentalSpace', 'name type location');

    return activeContract;
  }
}

module.exports = new ContractService();
