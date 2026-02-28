import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment';

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  globalStatus: string;
  createdAt: string;
}

export interface OrderSeller {
  sellerId: string;
  boutiqueName: string;
  status: string;
  subtotal: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetail {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  globalStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: {
    street?: string;
    city?: string;
    phone?: string;
  } | null;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  sellers: OrderSeller[];
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  data: OrderSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: OrderDetail;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  getOrders(page: number = 1, limit: number = 10): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
      this.getHeaders()
    );
  }

  getOrderDetail(orderId: string): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(
      `${this.apiUrl}/${orderId}`,
      this.getHeaders()
    );
  }
}
