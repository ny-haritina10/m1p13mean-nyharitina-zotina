import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CartService, Cart } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-customer-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-left">
        <div class="logo" routerLink="/">
          <span class="material-icons">storefront</span>
          <span>Centre Commercial</span>
        </div>
        <nav class="nav-main">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Accueil</a>
          <a routerLink="/products" routerLinkActive="active" class="nav-link">Produits</a>
          <a routerLink="/boutiques" routerLinkActive="active" class="nav-link">Boutiques</a>
        </nav>
      </div>

      <div class="header-right">
        <a routerLink="/cart" class="cart-link" title="Panier">
          <span class="material-icons">shopping_cart</span>
          <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
        </a>

        <div class="auth-buttons" *ngIf="!isLoggedIn">
          <a routerLink="/customer-login" [queryParams]="{demo: 'true'}" class="btn-customer">
            <span class="material-icons">person</span>
            <span class="btn-text">Connexion Client</span>
          </a>
          <a routerLink="/login" [queryParams]="{demo: 'seller'}" class="btn-backoffice">
            <span class="material-icons">admin_panel_settings</span>
            <span class="btn-text">Connexion Boutique</span>
          </a>
          <a routerLink="/login" [queryParams]="{demo: 'admin'}" class="btn-backoffice">
            <span class="material-icons">admin_panel_settings</span>
            <span class="btn-text">Connexion Admin</span>
          </a>
        </div>

        <div class="user-menu" *ngIf="isLoggedIn">
          <a routerLink="/orders" class="nav-link">Mes commandes</a>
          <a (click)="logout()" class="nav-link btn-logout">
            <span class="material-icons">logout</span>
            Se déconnecter
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 40px;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      cursor: pointer;
      text-decoration: none;
    }

    .logo .material-icons {
      color: #e94560;
      font-size: 28px;
    }

    .nav-main {
      display: flex;
      gap: 24px;
    }

    .nav-link {
      text-decoration: none;
      color: #636e72;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link:hover, .nav-link.active {
      color: #e94560;
    }

    .nav-link .material-icons {
      font-size: 20px;
    }

    .cart-link {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #f8f9fa;
      transition: all 0.2s;
    }

    .cart-link:hover {
      background: #f0f0f0;
    }

    .cart-link .material-icons {
      font-size: 22px;
      color: #636e72;
    }

    .cart-link:hover .material-icons {
      color: #e94560;
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #e94560;
      color: white;
      font-size: 11px;
      font-weight: 600;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    .auth-buttons {
      display: flex;
      gap: 10px;
    }

    .btn-customer, .btn-backoffice {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 13px;
      transition: all 0.2s;
    }

    .btn-customer {
      background: #f8f9fa;
      color: #636e72;
      border: 1px solid #e0e0e0;
    }

    .btn-customer:hover {
      background: #e94560;
      color: white;
      border-color: #e94560;
    }

    .btn-backoffice {
      background: #1a1a2e;
      color: white;
    }

    .btn-backoffice:hover {
      background: #2d2d4a;
    }

    .btn-customer .material-icons,
    .btn-backoffice .material-icons {
      font-size: 18px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-logout {
      background: #fee2e2;
      color: #dc2626 !important;
      padding: 8px 14px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-logout:hover {
      background: #fecaca;
    }

    .btn-logout .material-icons {
      font-size: 18px;
    }

    @media (max-width: 900px) {
      .header {
        padding: 12px 20px;
        flex-direction: column;
        gap: 16px;
      }

      .header-left, .header-right {
        width: 100%;
        justify-content: space-between;
      }

      .nav-main {
        display: none;
      }

      .btn-text {
        display: none;
      }

      .btn-customer, .btn-backoffice {
        padding: 10px;
      }
    }
  `]
})
export class CustomerNavbarComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private cartService: CartService = inject(CartService);

  cartCount = 0;

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: Cart | null) => {
      this.cartCount = cart?.totalQuantity || 0;
    });

    this.cartService.getCart().subscribe({
      next: (response: { data: { totalQuantity: number } }) => {
        this.cartCount = response.data.totalQuantity;
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
