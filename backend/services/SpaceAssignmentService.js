const RentalSpace = require('../models/RentalSpace');
const Contract = require('../models/Contract');
const User = require('../models/User');

class SpaceAssignmentService {
  async assignSpace(data, adminId) {
    const { sellerId, spaceId, startDate, endDate, monthlyRent, depositAmount } = data;

    const seller = await User.findOne({ _id: sellerId, role: 'boutique' });
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }

    if (seller.status !== 'approved') {
      const error = new Error('Seller must be approved to assign a space');
      error.statusCode = 400;
      throw error;
    }

    const space = await RentalSpace.findById(spaceId);
    if (!space) {
      const error = new Error('Rental space not found');
      error.statusCode = 404;
      throw error;
    }

    if (space.status !== 'available') {
      const error = new Error('Rental space is not available');
      error.statusCode = 400;
      throw error;
    }

    const existingActiveSellerContract = await Contract.findOne({
      seller: sellerId,
      status: 'active',
      endDate: { $gte: new Date() }
    });
    if (existingActiveSellerContract) {
      const error = new Error('Seller already has an active contract');
      error.statusCode = 400;
      throw error;
    }

    const existingSpaceContract = await Contract.findOne({
      rentalSpace: spaceId,
      status: 'active',
      endDate: { $gte: new Date() }
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
      rentalSpace: spaceId,
      startDate: start,
      endDate: end,
      monthlyRent: monthlyRent || space.monthlyPrice,
      depositAmount: depositAmount || 0,
      createdBy: adminId,
      status: 'active'
    });

    await contract.save();

    space.status = 'occupied';
    await space.save();

    return {
      message: 'Space assigned successfully',
      contract: {
        id: contract._id,
        seller: { id: seller._id, username: seller.username, boutiqueName: seller.boutiqueName },
        space: { id: space._id, name: space.name, type: space.type },
        startDate: contract.startDate,
        endDate: contract.endDate,
        monthlyRent: contract.monthlyRent,
        status: contract.status
      }
    };
  }

  async reassignSpace(contractId, newSpaceId, data, adminId) {
    const { startDate, endDate, monthlyRent } = data;

    const currentContract = await Contract.findById(contractId);
    if (!currentContract) {
      const error = new Error('Contract not found');
      error.statusCode = 404;
      throw error;
    }

    if (currentContract.status !== 'active') {
      const error = new Error('Can only reassign active contracts');
      error.statusCode = 400;
      throw error;
    }

    const newSpace = await RentalSpace.findById(newSpaceId);
    if (!newSpace) {
      const error = new Error('New rental space not found');
      error.statusCode = 404;
      throw error;
    }

    if (newSpace.status !== 'available') {
      const error = new Error('New rental space is not available');
      error.statusCode = 400;
      throw error;
    }

    const existingSpaceContract = await Contract.findOne({
      rentalSpace: newSpaceId,
      status: 'active',
      _id: { $ne: contractId }
    });
    if (existingSpaceContract) {
      const error = new Error('New rental space already has an active contract');
      error.statusCode = 400;
      throw error;
    }

    const oldSpace = await RentalSpace.findById(currentContract.rentalSpace);
    currentContract.status = 'terminated';
    currentContract.terminatedAt = new Date();
    await currentContract.save();

    if (oldSpace) {
      oldSpace.status = 'available';
      await oldSpace.save();
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : currentContract.endDate;

    const newContract = new Contract({
      seller: currentContract.seller,
      rentalSpace: newSpaceId,
      startDate: start,
      endDate: end,
      monthlyRent: monthlyRent || newSpace.monthlyPrice,
      depositAmount: 0,
      createdBy: adminId,
      status: 'active'
    });

    await newContract.save();

    newSpace.status = 'occupied';
    await newSpace.save();

    return {
      message: 'Space reassigned successfully',
      previousContract: {
        id: currentContract._id,
        status: currentContract.status,
        terminatedAt: currentContract.terminatedAt
      },
      newContract: {
        id: newContract._id,
        space: { id: newSpace._id, name: newSpace.name },
        startDate: newContract.startDate,
        endDate: newContract.endDate,
        monthlyRent: newContract.monthlyRent,
        status: newContract.status
      }
    };
  }

  async getAvailableSpacesForAssignment() {
    return RentalSpace.find({ status: 'available' })
      .select('name type floor location surface monthlyPrice')
      .sort({ floor: 1, name: 1 });
  }

  async getApprovedSellers() {
    return User.find({ role: 'boutique', status: 'approved' })
      .select('username boutiqueName phone email')
      .sort({ boutiqueName: 1, username: 1 });
  }
}

module.exports = new SpaceAssignmentService();
