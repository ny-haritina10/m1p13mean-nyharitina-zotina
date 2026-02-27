import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  promotionalPrice: number | null;
  promotionActive: boolean;
  image: string | null;
  stock: number;
  category: string;
  boutiqueName?: string;
}

export interface ProductSearchResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  searchProducts(search: string = '', page: number = 1, limit: number = 12): Observable<ProductSearchResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ProductSearchResponse>(this.apiUrl, { params });
  }
}
