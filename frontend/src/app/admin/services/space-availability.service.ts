import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AvailabilitySummary {
  totalSpaces: number;
  available: number;
  occupied: number;
  maintenance: number;
}

export interface RentalSpace {
  _id: string;
  name: string;
  type: 'box' | 'kiosque' | 'stand';
  floor: number;
  location?: string;
  surface?: number;
  monthlyPrice: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface SpacesByStatus {
  summary: AvailabilitySummary;
  availableSpaces: RentalSpace[];
  occupiedSpaces: RentalSpace[];
  maintenanceSpaces: RentalSpace[];
}

@Injectable({
  providedIn: 'root'
})
export class SpaceAvailabilityService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAvailability(): Observable<AvailabilitySummary> {
    return this.http.get<AvailabilitySummary>(`${this.apiUrl}/spaces/availability`);
  }

  getSpacesByStatus(): Observable<SpacesByStatus> {
    return this.http.get<SpacesByStatus>(`${this.apiUrl}/spaces/by-status`);
  }

  setMaintenance(spaceId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/spaces/${spaceId}/maintenance`, {});
  }

  removeMaintenance(spaceId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/spaces/${spaceId}/remove-maintenance`, {});
  }

  syncStatus(): Observable<any> {
    return this.http.post(`${this.apiUrl}/spaces/sync`, {});
  }
}
