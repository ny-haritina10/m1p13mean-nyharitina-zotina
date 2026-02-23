const financialReportService = require('../services/FinancialReportService');

exports.getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'month and year are required' });
    }
    const report = await financialReportService.getMonthlyReport(parseInt(month), parseInt(year));
    res.json(report);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getYearlyReport = async (req, res, next) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ error: 'year is required' });
    }
    const report = await financialReportService.getYearlyReport(parseInt(year));
    res.json(report);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getRevenueSummary = async (req, res, next) => {
  try {
    const summary = await financialReportService.getRevenueSummary();
    res.json(summary);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getUnpaidSummary = async (req, res, next) => {
  try {
    const summary = await financialReportService.getUnpaidSummary();
    res.json(summary);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
