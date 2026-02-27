import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { SellerGroupComponent } from '../../components/seller-group/seller-group.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';
import { CustomerNavbarComponent } from '../../../customer/components/navbar/customer-navbar.component';
import { CustomerFooterComponent } from '../../../customer/components/footer/customer-footer.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SellerGroupComponent, CartSummaryComponent, CustomerNavbarComponent, CustomerFooterComponent],
  template: `
    <div class="cart-page">
      <app-customer-navbar></app-customer-navbar>

      <div class="cart-container">
        <h1>Mon Panier</h1>

        <div *ngIf="loading" class="loading">
          <span class="material-icons">hourglass_empty</span>
          <p>Chargement du panier...</p>
        </div>

        <div *ngIf="!loading && cart && cart.totalQuantity === 0" class="empty-cart">
          <span class="material-icons">shopping_cart</span>
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et ajoutez-les à votre panier</p>
          <a routerLink="/products" class="btn-primary">Voir les produits</a>
        </div>

        <div *ngIf="!loading && cart && cart.totalQuantity > 0" class="cart-content">
          <div class="cart-items">
            <app-seller-group
              *ngFor="let group of cart.groupedBySeller"
              [group]="group"
              (quantityChange)="onQuantityChange($event)"
              (itemRemove)="onItemRemove($event)"
            ></app-seller-group>
          </div>

          <div class="cart-sidebar">
            <app-cart-summary
              [cart]="cart"
              (checkout)="onCheckout()"
            ></app-cart-summary>
          </div>
        </div>
      </div>

      <app-customer-footer></app-customer-footer>
    </div>
  `,
  styles: [`
    .cart-page {
      min-height: 100vh;
      background: #faf9f6;
    }

    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 32px 0;
    }

    .loading {
      text-align: center;
      padding: 80px 24px;
    }

    .loading .material-icons {
      font-size: 48px;
      color: #d1d5db;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading p {
      color: #6b7280;
      margin-top: 16px;
    }

    .empty-cart {
      text-align: center;
      padding: 80px 24px;
      background: white;
      border-radius: 16px;
    }

    .empty-cart .material-icons {
      font-size: 80px;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-cart h2 {
      font-size: 24px;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .empty-cart p {
      color: #6b7280;
      margin: 0 0 24px 0;
    }

    .btn-primary {
      display: inline-block;
      padding: 14px 32px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 32px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 1024px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-sidebar {
        order: -1;
      }
    }
  `]
})
export class CartPageComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response.data;
        this.cartService.updateCartSubject(response.data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onQuantityChange(event: { productId: string; quantity: number }): void {
    this.cartService.updateCartItem(event.productId, event.quantity).subscribe({
      next: (response) => {
        this.cart = response.data;
        this.cartService.updateCartSubject(response.data);
      }
    });
  }

  onItemRemove(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (response) => {
        this.cart = response.data;
        this.cartService.updateCartSubject(response.data);
      }
    });
  }

  onCheckout(): void {
    console.log('Checkout clicked - TODO');
  }
}
