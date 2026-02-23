import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RentPayment {
  _id: string;
  contract: any;
  seller: {
    _id: string;
    username: string;
    boutiqueName?: string;
  };
  month: number;
  year: number;
  amount: number;
  penaltyAmount: number;
  totalAmount: number;
  dueDate: string;
  paidAt?: string;
  status: 'pending' | 'paid' | 'late';
  createdAt: string;
}

export interface CreateRentDto {
  contractId: string;
  month: number;
  year: number;
}

export interface RentStats {
  totalExpected: number;
  totalCollected: number;
  totalUnpaid: number;
  lateCount: number;
  pendingCount: number;
  paidCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminRentService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  generateRent(data: CreateRentDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/rents/generate`, data);
  }

  getRents(status?: string, month?: number, year?: number, sellerId?: string): Observable<RentPayment[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    if (sellerId) params = params.set('sellerId', sellerId);
    return this.http.get<RentPayment[]>(`${this.apiUrl}/rents`, { params });
  }

  getRentById(id: string): Observable<RentPayment> {
    return this.http.get<RentPayment>(`${this.apiUrl}/rents/${id}`);
  }

  markAsPaid(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/rents/${id}/pay`, {});
  }

  checkLatePayments(): Observable<any> {
    return this.http.post(`${this.apiUrl}/rents/check-late`, {});
  }

  getStats(): Observable<RentStats> {
    return this.http.get<RentStats>(`${this.apiUrl}/rents/stats`);
  }
}
