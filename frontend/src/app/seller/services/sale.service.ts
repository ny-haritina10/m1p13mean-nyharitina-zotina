import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SaleProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id?: string;
  seller: string;
  products: SaleProduct[];
  totalAmount: number;
  paymentMethod: 'cash' | 'mobile_money' | 'card' | 'mixed';
  paymentStatus: 'paid' | 'pending' | 'partial';
  amountPaid: number;
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  saleDate: string;
  isPromotional: boolean;
  discount: number;
  notes?: string;
  createdAt: string;
}

export interface SalesResponse {
  sales: Sale[];
  totalSales: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DailyReport {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalItems: number;
  paymentMethods: { [key: string]: number };
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface RevenueStats {
  period: { start: string; end: string };
  totalRevenue: number;
  totalSales: number;
  averageSale: number;
  breakdown: {
    period: string;
    revenue: number;
    sales: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  createSale(data: any): Observable<{ message: string; sale: Sale }> {
    return this.http.post<{ message: string; sale: Sale }>(
      `${this.apiUrl}/sales`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getSales(filters?: any): Observable<SalesResponse> {
    return this.http.get<SalesResponse>(`${this.apiUrl}/sales`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: filters || {}
    });
  }

  getSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/sales/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  deleteSale(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/sales/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  getDailyReport(date: string): Observable<DailyReport> {
    return this.http.get<DailyReport>(`${this.apiUrl}/sales/report/daily`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { date }
    });
  }

  getRevenueStats(startDate: string, endDate: string, groupBy: string = 'day'): Observable<RevenueStats> {
    return this.http.get<RevenueStats>(`${this.apiUrl}/sales/stats/revenue`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { startDate, endDate, groupBy }
    });
  }

  getTopProducts(limit: number = 10): Observable<{ products: any[] }> {
    return this.http.get<{ products: any[] }>(`${this.apiUrl}/sales/stats/top-products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { limit }
    });
  }
}
