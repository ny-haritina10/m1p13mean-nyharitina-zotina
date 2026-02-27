import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from '../../services/cart.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-summary">
      <h3>Récapitulatif</h3>
      
      <div class="summary-row">
        <span>Nombre d'articles</span>
        <span>{{ cart?.totalQuantity || 0 }}</span>
      </div>
      
      <div class="summary-divider"></div>
      
      <div class="summary-row total">
        <span>Total</span>
        <span class="total-amount">{{ formatPrice(cart?.grandTotal || 0) }}</span>
      </div>

      <button 
        class="checkout-btn"
        [disabled]="!cart || cart.totalQuantity === 0"
        (click)="onCheckout()"
      >
        Commander
      </button>
    </div>
  `,
  styles: [`
    .cart-summary {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      position: sticky;
      top: 24px;
    }

    h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 15px;
      color: #4b5563;
    }

    .summary-row.total {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .total-amount {
      font-size: 24px;
      color: #2563eb;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 16px 0;
    }

    .checkout-btn {
      width: 100%;
      padding: 16px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 16px;
    }

    .checkout-btn:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-2px);
    }

    .checkout-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }
  `]
})
export class CartSummaryComponent {
  @Input() cart: Cart | null = null;
  @Output() checkout = new EventEmitter<void>();

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      minimumFractionDigits: 0 
    }).format(price);
  }

  onCheckout(): void {
    this.checkout.emit();
  }
}
