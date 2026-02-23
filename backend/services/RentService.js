const RentPayment = require('../models/RentPayment');
const Contract = require('../models/Contract');
const User = require('../models/User');

const PENALTY_RATE = 0.05;

class RentService {
  calculatePenalty(amount, dueDate) {
    const today = new Date();
    if (today > dueDate) {
      return Math.round(amount * PENALTY_RATE);
    }
    return 0;
  }

  async generateMonthlyRent(contractId, month, year) {
    const contract = await Contract.findById(contractId);
    if (!contract) {
      const error = new Error('Contract not found');
      error.statusCode = 404;
      throw error;
    }

    if (contract.status !== 'active') {
      const error = new Error('Cannot generate rent for inactive contract');
      error.statusCode = 400;
      throw error;
    }

    const existingRent = await RentPayment.findOne({
      contract: contractId,
      month,
      year
    });
    if (existingRent) {
      const error = new Error('Rent already generated for this month');
      error.statusCode = 400;
      throw error;
    }

    const dueDate = new Date(year, month - 1, 5);
    const penaltyAmount = this.calculatePenalty(contract.monthlyRent, dueDate);

    const rentPayment = new RentPayment({
      contract: contractId,
      seller: contract.seller,
      month,
      year,
      amount: contract.monthlyRent,
      penaltyAmount,
      totalAmount: contract.monthlyRent + penaltyAmount,
      dueDate,
      status: penaltyAmount > 0 ? 'late' : 'pending'
    });

    await rentPayment.save();

    const seller = await User.findById(contract.seller);

    return {
      message: 'Rent generated successfully',
      rentPayment: {
        id: rentPayment._id,
        seller: seller.boutiqueName || seller.username,
        month: rentPayment.month,
        year: rentPayment.year,
        amount: rentPayment.amount,
        penaltyAmount: rentPayment.penaltyAmount,
        totalAmount: rentPayment.totalAmount,
        status: rentPayment.status,
        dueDate: rentPayment.dueDate
      }
    };
  }

  async getRents(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.month) {
      query.month = filters.month;
    }

    if (filters.year) {
      query.year = filters.year;
    }

    if (filters.sellerId) {
      query.seller = filters.sellerId;
    }

    const rents = await RentPayment.find(query)
      .populate('seller', 'username boutiqueName')
      .populate({
        path: 'contract',
        populate: {
          path: 'rentalSpace',
          select: 'name type'
        }
      })
      .sort({ year: -1, month: -1 });

    return rents;
  }

  async getRentById(rentId) {
    const rent = await RentPayment.findById(rentId)
      .populate('seller', 'username boutiqueName phone')
      .populate({
        path: 'contract',
        populate: [
          { path: 'rentalSpace', select: 'name type location' },
          { path: 'createdBy', select: 'username' }
        ]
      });

    if (!rent) {
      const error = new Error('Rent payment not found');
      error.statusCode = 404;
      throw error;
    }

    return rent;
  }

  async markAsPaid(rentId) {
    const rent = await RentPayment.findById(rentId);
    if (!rent) {
      const error = new Error('Rent payment not found');
      error.statusCode = 404;
      throw error;
    }

    if (rent.status === 'paid') {
      const error = new Error('Rent already paid');
      error.statusCode = 400;
      throw error;
    }

    rent.status = 'paid';
    rent.paidAt = new Date();
    await rent.save();

    return {
      message: 'Rent marked as paid',
      rentPayment: {
        id: rent._id,
        status: rent.status,
        paidAt: rent.paidAt
      }
    };
  }

  async checkLatePayments() {
    const today = new Date();
    
    const pendingRents = await RentPayment.find({
      status: { $in: ['pending', 'late'] },
      dueDate: { $lt: today }
    });

    for (const rent of pendingRents) {
      rent.status = 'late';
      rent.penaltyAmount = this.calculatePenalty(rent.amount, rent.dueDate);
      rent.totalAmount = rent.amount + rent.penaltyAmount;
      await rent.save();
    }

    return {
      message: `Checked ${pendingRents.length} pending payments`,
      updatedCount: pendingRents.length
    };
  }

  async getSellerRentHistory(sellerId) {
    const rents = await RentPayment.find({ seller: sellerId })
      .populate('contract', 'rentalSpace')
      .sort({ year: -1, month: -1 });

    return rents;
  }

  async getDashboardStats() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const allRents = await RentPayment.find();
    
    const totalExpected = allRents.reduce((sum, r) => sum + r.amount, 0);
    const totalCollected = allRents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalUnpaid = allRents
      .filter(r => r.status !== 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    
    const lateCount = await RentPayment.countDocuments({ status: 'late' });
    const pendingCount = await RentPayment.countDocuments({ status: 'pending' });
    const paidCount = await RentPayment.countDocuments({ status: 'paid' });

    return {
      totalExpected,
      totalCollected,
      totalUnpaid,
      lateCount,
      pendingCount,
      paidCount
    };
  }
}

module.exports = new RentService();
