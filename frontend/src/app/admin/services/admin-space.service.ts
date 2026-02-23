import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RentalSpace {
  _id: string;
  name: string;
  type: 'box' | 'kiosque' | 'stand';
  location?: string;
  surface?: number;
  monthlyPrice: number;
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
}

export interface CreateSpaceDto {
  name: string;
  type: 'box' | 'kiosque' | 'stand';
  location?: string;
  surface?: number;
  monthlyPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSpaceService {
  private apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  getSpaces(status?: string, type?: string): Observable<RentalSpace[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<RentalSpace[]>(`${this.apiUrl}/spaces`, { params });
  }

  getAvailableSpaces(): Observable<RentalSpace[]> {
    return this.http.get<RentalSpace[]>(`${this.apiUrl}/spaces/available`);
  }

  getSpaceById(id: string): Observable<RentalSpace> {
    return this.http.get<RentalSpace>(`${this.apiUrl}/spaces/${id}`);
  }

  createSpace(data: CreateSpaceDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/spaces`, data);
  }

  updateSpace(id: string, data: Partial<CreateSpaceDto>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/spaces/${id}`, data);
  }
}
