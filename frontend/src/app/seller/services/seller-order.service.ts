import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: string[];
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  seller: string;
  products: OrderItem[];
  totalAmount: number;
  deliveryAddress?: {
    street: string;
    city: string;
    phone: string;
  };
  orderStatus: 'pending' | 'validated' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'mobile_money' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  validatedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  statusHistory: {
    status: string;
    changedAt: string;
    notes?: string;
  }[];
  internalNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  totalOrders: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: { [key: string]: number };
}

export interface OrderStats {
  period: { start: string; end: string };
  totalOrders: number;
  byStatus: { [key: string]: number };
  cancellationRate: number;
  averagePreparationTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class SellerOrderService {
  private apiUrl = 'http://localhost:5000/api/seller';

  constructor(private http: HttpClient) {}

  getOrders(filters?: any): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: filters || {}
    });
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  validateOrder(id: string, notes?: string): Observable<{ message: string; order: Order }> {
    return this.http.patch<{ message: string; order: Order }>(
      `${this.apiUrl}/orders/${id}/validate`,
      { notes },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  cancelOrder(id: string, reason: string, notes?: string): Observable<{ message: string; order: Order }> {
    return this.http.patch<{ message: string; order: Order }>(
      `${this.apiUrl}/orders/${id}/cancel`,
      { reason, notes },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  updateOrderStatus(id: string, status: string, notes?: string): Observable<{ message: string; order: Order }> {
    return this.http.patch<{ message: string; order: Order }>(
      `${this.apiUrl}/orders/${id}/status`,
      { status, notes },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  addInternalNote(id: string, notes: string): Observable<{ message: string; order: Order }> {
    return this.http.patch<{ message: string; order: Order }>(
      `${this.apiUrl}/orders/${id}/notes`,
      { notes },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getOrderStats(startDate: string, endDate: string): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.apiUrl}/orders/stats/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { startDate, endDate }
    });
  }

  createOrder(orderData: any): Observable<{ message: string; order: Order }> {
    return this.http.post<{ message: string; order: Order }>(
      `${this.apiUrl}/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
