import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StockMovement {
  _id?: string;
  product: {
    _id: string;
    name: string;
    images?: string[];
  };
  seller: string;
  type: 'entry' | 'out';
  quantity: number;
  reason: 'purchase' | 'return' | 'adjustment' | 'sale' | 'damage' | 'loss' | 'other';
  stockAfter: number;
  notes?: string;
  createdAt: string;
}

export interface MovementStats {
  totalEntries: number;
  totalOuts: number;
  totalMovements: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
  private apiUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  getMovements(filters?: any): Observable<{ movements: StockMovement[] }> {
    return this.http.get<{ movements: StockMovement[] }>(`${this.apiUrl}/stock/movements`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: filters || {}
    });
  }

  getMovement(id: string): Observable<StockMovement> {
    return this.http.get<StockMovement>(`${this.apiUrl}/stock/movements/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  createMovement(data: any): Observable<{ message: string; movement: StockMovement }> {
    return this.http.post<{ message: string; movement: StockMovement }>(
      `${this.apiUrl}/stock/movements`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getStats(startDate: string, endDate: string): Observable<MovementStats> {
    return this.http.get<MovementStats>(`${this.apiUrl}/stock/movements/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { startDate, endDate }
    });
  }

  getStatsByProduct(startDate: string, endDate: string): Observable<{ stats: { productId: string; totalEntries: number; totalOuts: number }[] }> {
    return this.http.get<{ stats: { productId: string; totalEntries: number; totalOuts: number }[] }>(
      `${this.apiUrl}/stock/movements/stats/by-product`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { startDate, endDate }
      }
    );
  }
}
