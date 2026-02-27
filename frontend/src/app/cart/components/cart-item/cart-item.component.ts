import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <div class="item-image">
        <img [src]="item.image || '/assets/images/placeholder.png'" [alt]="item.name" />
      </div>
      
      <div class="item-details">
        <h4 class="item-name">{{ item.name }}</h4>
        <p class="item-seller">
          <span class="material-icons">store</span>
          {{ item.seller.boutiqueName }}
        </p>
        <p class="item-price">{{ formatPrice(item.unitPrice) }} / unité</p>
      </div>

      <div class="item-quantity">
        <button 
          class="qty-btn" 
          (click)="decreaseQuantity()"
          [disabled]="item.quantity <= 1"
        >
          <span class="material-icons">remove</span>
        </button>
        <span class="qty-value">{{ item.quantity }}</span>
        <button 
          class="qty-btn"
          (click)="increaseQuantity()"
        >
          <span class="material-icons">add</span>
        </button>
      </div>

      <div class="item-subtotal">
        <span class="subtotal-label">Total</span>
        <span class="subtotal-value">{{ formatPrice(item.subtotal) }}</span>
      </div>

      <button class="remove-btn" (click)="onRemove()">
        <span class="material-icons">delete</span>
      </button>
    </div>
  `,
  styles: [`
    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .item-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-seller {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 4px 0;
    }

    .item-seller .material-icons {
      font-size: 14px;
    }

    .item-price {
      font-size: 14px;
      color: #4b5563;
      margin: 0;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .qty-btn:hover:not(:disabled) {
      border-color: #2563eb;
      color: #2563eb;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-btn .material-icons {
      font-size: 18px;
    }

    .qty-value {
      font-size: 16px;
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }

    .item-subtotal {
      text-align: right;
      min-width: 100px;
    }

    .subtotal-label {
      display: block;
      font-size: 12px;
      color: #6b7280;
    }

    .subtotal-value {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .remove-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: #fee2e2;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: #fecaca;
    }

    .remove-btn .material-icons {
      color: #dc2626;
      font-size: 20px;
    }

    @media (max-width: 768px) {
      .cart-item {
        flex-wrap: wrap;
      }

      .item-image {
        width: 60px;
        height: 60px;
      }

      .item-details {
        flex: 1 1 calc(100% - 76px);
      }

      .item-quantity {
        order: 10;
        flex: 1 1 100%;
        justify-content: center;
        margin-top: 12px;
      }

      .item-subtotal {
        order: 9;
        flex: 1;
        text-align: left;
      }

      .remove-btn {
        order: 11;
      }
    }
  `]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0 
    }).format(price);
  }

  increaseQuantity(): void {
    this.quantityChange.emit(this.item.quantity + 1);
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  onRemove(): void {
    this.remove.emit();
  }
}
