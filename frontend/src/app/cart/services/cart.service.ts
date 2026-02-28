import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  seller: {
    id: string;
    boutiqueName: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SellerGroup {
  sellerId: string;
  boutiqueName: string;
  items: CartItem[];
  sellerSubtotal: number;
}

export interface Cart {
  items: CartItem[];
  groupedBySeller: SellerGroup[];
  totalQuantity: number;
  grandTotal: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

const SESSION_ID_KEY = 'cart_session_id';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initSessionId();
  }

  private initSessionId(): void {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Session-Id': this.getSessionId()
    });
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  addToCart(productId: string, quantity: number = 1): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/add`, { productId, quantity }, { headers: this.getHeaders() });
  }

  updateCartItem(productId: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.apiUrl}/item/${productId}`, { quantity }, { headers: this.getHeaders() });
  }

  removeFromCart(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/item/${productId}`, { headers: this.getHeaders() });
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/clear`, { headers: this.getHeaders() });
  }

  updateCartSubject(cart: Cart): void {
    this.cartSubject.next(cart);
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.totalQuantity : 0;
  }
}
