const invoiceService = require('../services/InvoiceService');
const fs = require('fs');

exports.generateInvoice = async (req, res, next) => {
  try {
    const result = await invoiceService.generateInvoice(req.params.rentPaymentId);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.downloadInvoice = async (req, res, next) => {
  try {
    const pdfPath = await invoiceService.downloadInvoice(
      req.params.invoiceId,
      req.user.userId,
      req.user.role
    );
    
    res.download(pdfPath);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getInvoiceByPayment = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceByPayment(req.params.rentPaymentId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};
