import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  isPromotional?: boolean;
  promotionalPrice?: number;
  promotionalStartDate?: string;
  promotionalEndDate?: string;
  createdAt?: string;
}

export interface Category {
  _id?: string;
  name: string;
  productCount?: number;
  isActive?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  lowStockCount: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/seller';

  constructor(private http: HttpClient) {}

  getProducts(filters?: any): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: filters || {}
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  createProduct(data: any): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(
      `${this.apiUrl}/products`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  updateProduct(id: string, data: any): Observable<{ message: string; product: Product }> {
    return this.http.patch<{ message: string; product: Product }>(
      `${this.apiUrl}/products/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  getLowStockProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/products/low-stock`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  createCategory(name: string): Observable<{ message: string; category: Category }> {
    return this.http.post<{ message: string; category: Category }>(
      `${this.apiUrl}/categories`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  deleteCategory(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  getStats(): Observable<{ totalProducts: number; activeProducts: number; outOfStock: number; lowStock: number }> {
    return this.http.get<{ totalProducts: number; activeProducts: number; outOfStock: number; lowStock: number }>(`${this.apiUrl}/products/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
