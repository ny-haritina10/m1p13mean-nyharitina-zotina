import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Seller {
  _id: string;
  username: string;
  boutiqueName?: string;
  phone?: string;
  email?: string;
}

export interface Space {
  _id: string;
  name: string;
  type: 'box' | 'kiosque' | 'stand';
  floor: number;
  location?: string;
  surface?: number;
  monthlyPrice: number;
}

export interface AssignSpaceDto {
  sellerId: string;
  spaceId: string;
  startDate: string;
  endDate: string;
  monthlyRent?: number;
  depositAmount?: number;
}

export interface ReassignSpaceDto {
  spaceId: string;
  startDate?: string;
  endDate?: string;
  monthlyRent?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpaceAssignmentService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAvailableSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(`${this.apiUrl}/spaces/assign/available`);
  }

  getApprovedSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(`${this.apiUrl}/spaces/assign/sellers`);
  }

  assignSpace(data: AssignSpaceDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/spaces/assign`, data);
  }

  reassignSpace(contractId: string, data: ReassignSpaceDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/spaces/reassign/${contractId}`, data);
  }
}
