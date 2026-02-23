const RentPayment = require('../models/RentPayment');
const Contract = require('../models/Contract');
const User = require('../models/User');

class FinancialReportService {
  async getMonthlyReport(month, year) {
    const rents = await RentPayment.find({ month, year })
      .populate('seller', 'username boutiqueName')
      .populate({
        path: 'contract',
        populate: { path: 'rentalSpace', select: 'name type' }
      });

    const totalExpected = rents.reduce((sum, r) => sum + r.amount, 0);
    const totalCollected = rents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalUnpaid = rents
      .filter(r => r.status !== 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const paidCount = rents.filter(r => r.status === 'paid').length;
    const unpaidCount = rents.filter(r => r.status !== 'paid').length;
    const lateCount = rents.filter(r => r.status === 'late').length;

    return {
      month,
      year,
      totalExpectedRevenue: totalExpected,
      totalCollected,
      totalUnpaid,
      latePayments: lateCount,
      paidCount,
      unpaidCount,
      payments: rents
    };
  }

  async getYearlyReport(year) {
    const rents = await RentPayment.find({ year })
      .populate('seller', 'username boutiqueName');

    const monthlyBreakdown = [];
    for (let month = 1; month <= 12; month++) {
      const monthRents = rents.filter(r => r.month === month);
      const revenue = monthRents
        .filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + r.totalAmount, 0);
      
      monthlyBreakdown.push({
        month,
        revenue,
        paidCount: monthRents.filter(r => r.status === 'paid').length,
        unpaidCount: monthRents.filter(r => r.status !== 'paid').length
      });
    }

    const totalRevenue = monthlyBreakdown.reduce((sum, m) => sum + m.revenue, 0);

    return {
      year,
      totalRevenue,
      monthlyBreakdown
    };
  }

  async getRevenueSummary() {
    const allRents = await RentPayment.find();

    const totalExpected = allRents.reduce((sum, r) => sum + r.amount, 0);
    const totalCollected = allRents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalUnpaid = allRents
      .filter(r => r.status !== 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const paidCount = allRents.filter(r => r.status === 'paid').length;
    const pendingCount = allRents.filter(r => r.status === 'pending').length;
    const lateCount = allRents.filter(r => r.status === 'late').length;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const currentMonthRents = allRents.filter(
      r => r.year === currentYear && r.month === currentMonth
    );
    const currentMonthRevenue = currentMonthRents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const yearlyRents = allRents.filter(r => r.year === currentYear);
    const yearlyRevenue = yearlyRents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      totalExpected,
      totalCollected,
      totalUnpaid,
      paidCount,
      pendingCount,
      lateCount,
      currentMonthRevenue,
      yearlyRevenue,
      collectionRate: totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(2) : 0
    };
  }

  async getUnpaidSummary() {
    const unpaidRents = await RentPayment.find({ status: { $ne: 'paid' } })
      .populate('seller', 'username boutiqueName')
      .populate({
        path: 'contract',
        populate: { path: 'rentalSpace', select: 'name' }
      })
      .sort({ dueDate: 1 });

    const totalUnpaid = unpaidRents.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      totalUnpaid,
      count: unpaidRents.length,
      payments: unpaidRents
    };
  }

  async getSellerFinancialHistory(sellerId) {
    const rents = await RentPayment.find({ seller: sellerId })
      .populate({
        path: 'contract',
        populate: { path: 'rentalSpace', select: 'name type' }
      })
      .sort({ year: -1, month: -1 });

    const totalPaid = rents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalPending = rents
      .filter(r => r.status !== 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      seller: sellerId,
      totalPaid,
      totalPending,
      payments: rents
    };
  }
}

module.exports = new FinancialReportService();
