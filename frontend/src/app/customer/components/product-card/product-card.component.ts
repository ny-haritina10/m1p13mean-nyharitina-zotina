import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card" [class.has-promotion]="product.promotionActive">
      <div class="card-image">
        <img 
          [src]="product.image || '/assets/images/placeholder.png'" 
          [alt]="product.name"
          loading="lazy"
          (error)="onImageError($event)"
        />
        <span *ngIf="product.promotionActive" class="badge promotion">Promotion</span>
        <span *ngIf="product.stock <= 5 && product.stock > 0" class="badge stock-low">Stock faible</span>
      </div>
      
      <div class="card-content">
        <div class="category">{{ product.category }}</div>
        <h3 class="product-name">{{ product.name }}</h3>
        
        <div class="price-container">
          <span *ngIf="product.promotionActive" class="original-price">{{ formatPrice(product.price) }}</span>
          <span class="current-price">
            {{ formatPrice(product.promotionalPrice || product.price) }}
          </span>
        </div>
        
        <div class="boutique" *ngIf="product.boutiqueName">
          <span class="material-icons">store</span>
          {{ product.boutiqueName }}
        </div>
        
        <button class="btn-details">Voir détail</button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }

    .card-image {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: #f8f9fa;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .card-image img {
      transform: scale(1.05);
    }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge.promotion {
      background: #ef4444;
      color: white;
    }

    .badge.stock-low {
      background: #f59e0b;
      color: white;
      left: auto;
      right: 12px;
    }

    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .category {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .product-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .original-price {
      font-size: 14px;
      color: #9ca3af;
      text-decoration: line-through;
    }

    .current-price {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .has-promotion .current-price {
      color: #ef4444;
    }

    .boutique {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 12px;
    }

    .boutique .material-icons {
      font-size: 16px;
    }

    .btn-details {
      margin-top: auto;
      width: 100%;
      padding: 12px;
      background: #f3f4f6;
      border: none;
      border-radius: 10px;
      color: #374151;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-details:hover {
      background: #e5e7eb;
    }

    @media (max-width: 640px) {
      .card-content {
        padding: 12px;
      }

      .product-name {
        font-size: 14px;
      }

      .current-price {
        font-size: 18px;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0 
    }).format(price);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/placeholder.png';
  }
}
