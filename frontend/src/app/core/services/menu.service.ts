import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getMenu(): Observable<{ menu: MenuItem[] }> {
    return this.http.get<{ menu: MenuItem[] }>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getAllMenus(): Observable<{ menus: MenuItem[] }> {
    return this.http.get<{ menus: MenuItem[] }>(`${this.apiUrl}/menus`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
