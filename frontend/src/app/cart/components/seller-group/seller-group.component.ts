import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartItem, SellerGroup } from '../../services/cart.service';

@Component({
  selector: 'app-seller-group',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  template: `
    <div class="seller-group">
      <div class="seller-header">
        <span class="material-icons">store</span>
        <h3>{{ group.boutiqueName }}</h3>
        <span class="seller-subtotal">{{ formatPrice(group.sellerSubtotal) }}</span>
      </div>
      
      <div class="seller-items">
        <app-cart-item
          *ngFor="let item of group.items"
          [item]="item"
          (quantityChange)="onQuantityChange(item.productId, $event)"
          (remove)="onRemove(item.productId)"
        ></app-cart-item>
      </div>
    </div>
  `,
  styles: [`
    .seller-group {
      margin-bottom: 24px;
    }

    .seller-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .seller-header .material-icons {
      color: #4f46e5;
      font-size: 20px;
    }

    .seller-header h3 {
      flex: 1;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .seller-subtotal {
      font-size: 16px;
      font-weight: 700;
      color: #4f46e5;
    }

    .seller-items {
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 12px 12px;
      overflow: hidden;
    }

    .seller-items app-cart-item {
      display: block;
      border-bottom: 1px solid #e5e7eb;
    }

    .seller-items app-cart-item:last-child {
      border-bottom: none;
    }
  `]
})
export class SellerGroupComponent {
  @Input() group!: SellerGroup;
  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() itemRemove = new EventEmitter<string>();

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0 
    }).format(price);
  }

  onQuantityChange(productId: string, quantity: number): void {
    this.quantityChange.emit({ productId, quantity });
  }

  onRemove(productId: string): void {
    this.itemRemove.emit(productId);
  }
}
