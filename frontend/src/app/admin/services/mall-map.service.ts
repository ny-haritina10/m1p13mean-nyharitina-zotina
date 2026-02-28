import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MapSpace {
  id: string;
  name: string;
  type: 'box' | 'kiosque' | 'stand';
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  location?: string;
  surface?: number;
  monthlyPrice: number;
  x: number;
  y: number;
  width: number;
  height: number;
  currentContract?: {
    seller: { username: string; boutiqueName?: string };
    startDate: string;
    endDate: string;
    monthlyRent: number;
  };
}

export interface SpaceDetails {
  id: string;
  name: string;
  type: string;
  floor: number;
  location: string;
  surface: number;
  monthlyPrice: number;
  status: string;
  mapPosition: { x: number; y: number };
  width: number;
  height: number;
  currentContract: any;
  contractHistory: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MallMapService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getMapData(floor?: number): Observable<MapSpace[]> {
    let params = new HttpParams();
    if (floor) params = params.set('floor', floor.toString());
    return this.http.get<MapSpace[]>(`${this.apiUrl}/map`, { params });
  }

  getFloors(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/map/floors`);
  }

  getSpaceDetails(spaceId: string): Observable<SpaceDetails> {
    return this.http.get<SpaceDetails>(`${this.apiUrl}/map/space/${spaceId}`);
  }

  updateMapPosition(spaceId: string, data: { x: number; y: number; width?: number; height?: number }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/map/space/${spaceId}/position`, data);
  }
}
