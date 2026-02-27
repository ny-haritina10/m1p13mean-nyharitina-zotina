import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stock-badge" [ngClass]="stockClass">
      <span class="material-icons">{{ stockIcon }}</span>
      <span class="stock-text">{{ stockText }}</span>
    </div>
  `,
  styles: [`
    .stock-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }

    .stock-badge .material-icons {
      font-size: 18px;
    }

    .in-stock {
      background: #dcfce7;
      color: #166534;
    }

    .stock-low {
      background: #fef3c7;
      color: #92400e;
    }

    .out-of-stock {
      background: #fee2e2;
      color: #991b1b;
    }

    @media (max-width: 640px) {
      .stock-badge {
        padding: 6px 12px;
        font-size: 13px;
      }
    }
  `]
})
export class StockBadgeComponent {
  @Input() stock: number = 0;
  @Input() lowStockThreshold: number = 5;

  get stockClass(): string {
    if (this.stock === 0) {
      return 'out-of-stock';
    } else if (this.stock <= this.lowStockThreshold) {
      return 'stock-low';
    }
    return 'in-stock';
  }

  get stockText(): string {
    if (this.stock === 0) {
      return 'Rupture de stock';
    } else if (this.stock <= this.lowStockThreshold) {
      return `Stock faible (${this.stock} restants)`;
    }
    return 'En stock';
  }

  get stockIcon(): string {
    if (this.stock === 0) {
      return 'remove_shopping_cart';
    } else if (this.stock <= this.lowStockThreshold) {
      return 'warning';
    }
    return 'check_circle';
  }
}
