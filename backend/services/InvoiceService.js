const RentPayment = require('../models/RentPayment');
const Invoice = require('../models/Invoice');
const Contract = require('../models/Contract');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const INVOICES_DIR = path.join(__dirname, '../invoices');

if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

class InvoiceService {
  async generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const lastInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^INV-${year}-`) })
      .sort({ invoiceNumber: -1 });

    let sequence = 1;
    if (lastInvoice) {
      const parts = lastInvoice.invoiceNumber.split('-');
      sequence = parseInt(parts[2]) + 1;
    }

    return `INV-${year}-${sequence.toString().padStart(4, '0')}`;
  }

  async generateInvoice(rentPaymentId) {
    const rentPayment = await RentPayment.findById(rentPaymentId)
      .populate('seller', 'username boutiqueName phone')
      .populate({
        path: 'contract',
        populate: { path: 'rentalSpace', select: 'name type location' }
      });

    if (!rentPayment) {
      const error = new Error('Rent payment not found');
      error.statusCode = 404;
      throw error;
    }

    const existingInvoice = await Invoice.findOne({ rentPayment: rentPaymentId });
    if (existingInvoice) {
      const error = new Error('Invoice already generated for this payment');
      error.statusCode = 400;
      throw error;
    }

    const invoiceNumber = await this.generateInvoiceNumber();
    const pdfPath = await this.buildInvoicePDF(rentPayment, invoiceNumber);

    const invoice = new Invoice({
      rentPayment: rentPaymentId,
      invoiceNumber,
      issueDate: new Date(),
      pdfPath,
      totalAmount: rentPayment.totalAmount,
      status: 'generated'
    });

    await invoice.save();

    return {
      message: 'Invoice generated successfully',
      invoice: {
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        totalAmount: invoice.totalAmount
      }
    };
  }

  async buildInvoicePDF(rentPayment, invoiceNumber) {
    return new Promise((resolve, reject) => {
      const fileName = `${invoiceNumber}.pdf`;
      const filePath = path.join(INVOICES_DIR, fileName);
      const stream = fs.createWriteStream(filePath);

      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(stream);

      doc.fontSize(24).fillColor('#1a1a2e').text('CENTRE COMMERCIAL', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor('#636e72').text('123 Avenue Commercial, Antananarivo', { align: 'center' });
      doc.text('contact@centreactcommercial.mg | +261 34 12 345 67', { align: 'center' });
      
      doc.moveDown(2);
      doc.fontSize(18).fillColor('#1a1a2e').text('FACTURE DE LOYER', { align: 'center' });
      
      doc.moveDown();
      doc.fontSize(11).fillColor('#636e72');
      doc.text(`Numéro de facture: ${invoiceNumber}`);
      doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`);
      
      doc.moveDown(2);
      doc.fontSize(12).fillColor('#1a1a2e').text('Informations du locataire:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#2d3436');
      doc.text(`Boutique: ${rentPayment.seller.boutiqueName || rentPayment.seller.username}`);
      if (rentPayment.seller.phone) {
        doc.text(`Téléphone: ${rentPayment.seller.phone}`);
      }
      
      doc.moveDown();
      doc.fontSize(12).fillColor('#1a1a2e').text('Détails du contrat:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#2d3436');
      doc.text(`Espace: ${rentPayment.contract?.rentalSpace?.name || 'N/A'}`);
      doc.text(`Type: ${rentPayment.contract?.rentalSpace?.type || 'N/A'}`);
      
      doc.moveDown(2);
      doc.fontSize(12).fillColor('#1a1a2e').text('Période de location:', { underline: true });
      doc.moveDown(0.5);
      
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const period = `${months[rentPayment.month - 1]} ${rentPayment.year}`;
      doc.fontSize(11).fillColor('#2d3436').text(period);
      
      doc.moveDown(2);
      
      const startY = doc.y;
      doc.fontSize(12).fillColor('#1a1a2e').text('Détail des montants:');
      doc.moveDown();
      
      const amounts = [
        { label: 'Loyer de base', amount: rentPayment.amount },
        { label: 'Pénalité', amount: rentPayment.penaltyAmount },
        { label: 'Total à payer', amount: rentPayment.totalAmount, bold: true }
      ];
      
      amounts.forEach((item, index) => {
        if (item.bold) {
          doc.fontSize(12).fillColor('#e94560').text(`${item.label}: ${item.amount.toLocaleString('fr-FR')} Ar`, { continued: false });
        } else {
          doc.fontSize(11).fillColor('#2d3436').text(`${item.label}: ${item.amount.toLocaleString('fr-FR')} Ar`, { continued: false });
        }
        doc.moveDown(0.5);
      });
      
      doc.moveDown(2);
      
      const statusColors = {
        'paid': '#00b894',
        'pending': '#fdcb6e',
        'late': '#e74c3c'
      };
      
      doc.fontSize(12).fillColor('#1a1a2e').text('Statut du paiement:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor(statusColors[rentPayment.status] || '#2d3436');
      const statusLabels = { 'paid': 'PAYÉ', 'pending': 'EN ATTENTE', 'late': 'EN RETARD' };
      doc.text(statusLabels[rentPayment.status] || rentPayment.status.toUpperCase());
      
      if (rentPayment.paidAt) {
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#636e72').text(`Payé le: ${new Date(rentPayment.paidAt).toLocaleDateString('fr-FR')}`);
      }
      
      doc.moveDown(3);
      doc.fontSize(10).fillColor('#636e72').text('Merci de votre confiance!', { align: 'center' });
      
      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  async downloadInvoice(invoiceId, userId, userRole) {
    const invoice = await Invoice.findById(invoiceId);
    
    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }

    if (userRole === 'boutique') {
      const rentPayment = await RentPayment.findById(invoice.rentPayment);
      if (rentPayment.seller.toString() !== userId) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
      }
    }

    if (!fs.existsSync(invoice.pdfPath)) {
      const error = new Error('PDF file not found');
      error.statusCode = 404;
      throw error;
    }

    return invoice.pdfPath;
  }

  async getInvoiceByPayment(rentPaymentId) {
    return await Invoice.findOne({ rentPayment: rentPaymentId });
  }
}

module.exports = new InvoiceService();
