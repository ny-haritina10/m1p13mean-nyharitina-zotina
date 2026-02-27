import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role: string;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private customerApiUrl = 'http://localhost:5000/api/customers';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  registerCustomer(data: RegisterData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.customerApiUrl}/register`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  loginCustomer(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.customerApiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): { id: string; username: string; role: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  isCustomer(): boolean {
    const user = this.getUser();
    return user?.role === 'customer';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
