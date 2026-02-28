import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface MonthlyReport {
  month: number;
  year: number;
  totalExpectedRevenue: number;
  totalCollected: number;
  totalUnpaid: number;
  latePayments: number;
  paidCount: number;
  unpaidCount: number;
  payments: any[];
}

export interface YearlyReport {
  year: number;
  totalRevenue: number;
  monthlyBreakdown: { month: number; revenue: number; paidCount: number; unpaidCount: number }[];
}

export interface RevenueSummary {
  totalExpected: number;
  totalCollected: number;
  totalUnpaid: number;
  paidCount: number;
  pendingCount: number;
  lateCount: number;
  currentMonthRevenue: number;
  yearlyRevenue: number;
  collectionRate: string;
}

export interface Invoice {
  _id: string;
  id?: string;
  rentPayment: string;
  invoiceNumber: string;
  issueDate: string;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialReportService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getMonthlyReport(month: number, year: number): Observable<MonthlyReport> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get<MonthlyReport>(`${this.apiUrl}/reports/monthly`, { params });
  }

  getYearlyReport(year: number): Observable<YearlyReport> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<YearlyReport>(`${this.apiUrl}/reports/yearly`, { params });
  }

  getRevenueSummary(): Observable<RevenueSummary> {
    return this.http.get<RevenueSummary>(`${this.apiUrl}/reports/summary`);
  }

  getUnpaidSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/unpaid`);
  }

  generateInvoice(rentPaymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoices/${rentPaymentId}`, {});
  }

  downloadInvoice(invoiceId: string): void {
    this.http.get(`${this.apiUrl}/invoices/${invoiceId}/download`, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading invoice', err)
    });
  }

  getInvoiceByPayment(rentPaymentId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/invoices/payment/${rentPaymentId}`);
  }
}
