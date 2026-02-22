import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seller {
  _id: string;
  username: string;
  boutiqueName?: string;
  phone?: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'active';
  createdAt: string;
  approvedAt?: string;
}

export interface CreateSellerDto {
  username: string;
  password: string;
  boutiqueName?: string;
  phone?: string;
}

export interface UpdateSellerDto {
  boutiqueName?: string;
  phone?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSellerService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  getSellers(status?: string): Observable<Seller[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Seller[]>(`${this.apiUrl}/sellers`, { params });
  }

  getSellerById(id: string): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/sellers/${id}`);
  }

  createSeller(data: CreateSellerDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/sellers`, data);
  }

  updateSeller(id: string, data: UpdateSellerDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/sellers/${id}`, data);
  }

  approveSeller(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sellers/${id}/approve`, {});
  }

  rejectSeller(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sellers/${id}/reject`, {});
  }

  suspendSeller(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sellers/${id}/suspend`, {});
  }

  reactivateSeller(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/sellers/${id}/reactivate`, {});
  }
}
