import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PromotionalProduct {
  _id: string;
  name: string;
  price: number;
  promotionalPrice: number;
  isPromotional: boolean;
  promotionalStartDate?: string;
  promotionalEndDate?: string;
  stock: number;
  images?: string[];
}

export interface SetPromotionData {
  productId: string;
  promotionalPrice: number;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  setPromotionalPrice(data: SetPromotionData): Observable<{ message: string; product: PromotionalProduct }> {
    return this.http.post<{ message: string; product: PromotionalProduct }>(
      `${this.apiUrl}/products/promotion`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  removePromotionalPrice(productId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/products/${productId}/promotion`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
  }

  getPromotionalProducts(): Observable<{ products: PromotionalProduct[] }> {
    return this.http.get<{ products: PromotionalProduct[] }>(
      `${this.apiUrl}/products/promotional`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
  }
}
