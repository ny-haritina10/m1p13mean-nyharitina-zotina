import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="price-container" [class.has-promotion]="promotionActive">
      <span *ngIf="promotionActive" class="original-price">{{ formatPrice(price) }}</span>
      <span class="current-price">
        {{ formatPrice(promotionalPrice || price) }}
      </span>
      <span *ngIf="promotionActive" class="promotion-badge">
        <span class="material-icons">local_offer</span>
        Promotion
      </span>
    </div>
  `,
  styles: [`
    .price-container {
      display: flex;
      align-items: baseline;
      gap: 12px;
      flex-wrap: wrap;
    }

    .original-price {
      font-size: 18px;
      color: #9ca3af;
      text-decoration: line-through;
    }

    .current-price {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
    }

    .has-promotion .current-price {
      color: #ef4444;
      font-size: 36px;
    }

    .promotion-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ef4444;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .promotion-badge .material-icons {
      font-size: 14px;
    }

    @media (max-width: 640px) {
      .current-price {
        font-size: 28px;
      }

      .has-promotion .current-price {
        font-size: 30px;
      }
    }
  `]
})
export class PriceDisplayComponent {
  @Input() price: number = 0;
  @Input() promotionalPrice: number | null = null;
  @Input() promotionActive: boolean = false;

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0 
    }).format(price);
  }
}
