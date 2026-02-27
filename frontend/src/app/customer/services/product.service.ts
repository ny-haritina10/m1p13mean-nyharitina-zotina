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

export interface FilterOptions {
  success: boolean;
  categories: string[];
  boutiques: string[];
}

export interface ProductDetailResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    description: string;
    price: number;
    promotionActive: boolean;
    promotionalPrice: number | null;
    stock: number;
    status: string;
    images: string[];
    category: string;
    boutique: {
      name: string;
      location: {
        zone: string | null;
        floor: string | null;
        unitNumber: string | null;
      };
    };
  };
}

export interface ProductFilters {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
  boutique?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  promotion?: boolean;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  searchProducts(filters: ProductFilters = {}): Observable<ProductSearchResponse> {
    let params = new HttpParams()
      .set('page', (filters.page || 1).toString())
      .set('limit', (filters.limit || 12).toString());

    if (filters.search && filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.boutique) {
      params = params.set('boutique', filters.boutique);
    }
    if (filters.minPrice) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.promotion) {
      params = params.set('promotion', 'true');
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this.http.get<ProductSearchResponse>(this.apiUrl, { params });
  }

  getFilterOptions(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(this.apiUrl + '/filters');
  }

  getProductDetail(id: string): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.apiUrl}/${id}`);
  }
}
