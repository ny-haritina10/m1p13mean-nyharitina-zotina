import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seller } from './admin-seller.service';
import { RentalSpace } from './admin-space.service';
import { environment } from '../../../environments/environment';

export interface Contract {
  _id: string;
  seller: Seller;
  rentalSpace: RentalSpace;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  status: 'active' | 'expired' | 'terminated';
  paymentStatus: 'paid' | 'unpaid' | 'late';
  createdBy: any;
  createdAt: string;
  terminatedAt?: string;
}

export interface CreateContractDto {
  sellerId: string;
  rentalSpaceId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminContractService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getContracts(status?: string, sellerId?: string): Observable<Contract[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (sellerId) {
      params = params.set('sellerId', sellerId);
    }
    return this.http.get<Contract[]>(`${this.apiUrl}/contracts`, { params });
  }

  getContractById(id: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/contracts/${id}`);
  }

  createContract(data: CreateContractDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/contracts`, data);
  }

  terminateContract(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/contracts/${id}/terminate`, {});
  }
}
