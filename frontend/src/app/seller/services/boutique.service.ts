import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Boutique {
  _id?: string;
  name: string;
  description: string;
  logo: string;
  phone: string;
  email: string;
  location: {
    floor: number;
    zone: string;
    spaceNumber: string;
  };
  openingHours: {
    [key: string]: { open: string; close: string };
  };
  status?: string;
}

export interface BoutiqueResponse {
  boutique: Boutique;
  location?: {
    spaceNumber: string;
    contractInfo?: {
      startDate: string;
      endDate: string;
      monthlyRent: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:5000/api/seller';

  constructor(private http: HttpClient) {}

  getBoutique(): Observable<BoutiqueResponse> {
    return this.http.get<BoutiqueResponse>(`${this.apiUrl}/boutique`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  saveBoutique(data: Boutique): Observable<{ message: string; boutique: Boutique }> {
    return this.http.post<{ message: string; boutique: Boutique }>(
      `${this.apiUrl}/boutique`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
