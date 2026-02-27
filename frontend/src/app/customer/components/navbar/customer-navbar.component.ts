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
      <div class="logo" routerLink="/">
        <span class="material-icons">storefront</span>
        <span>Centre Commercial</span>
      </div>
      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Accueil</a>
        <a routerLink="/products" routerLinkActive="active" class="nav-link">Produits</a>
        
        <a routerLink="/cart" class="nav-link cart-link">
          <span class="material-icons">shopping_cart</span>
          <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
        </a>
        
        <ng-container *ngIf="!isLoggedIn">
          <a routerLink="/customer-login" class="nav-link">Connexion</a>
          <a routerLink="/register" class="nav-link btn-register">Créer un compte</a>
        </ng-container>
        <ng-container *ngIf="isLoggedIn">
          <a routerLink="/orders" class="nav-link">Mes commandes</a>
          <a (click)="logout()" class="nav-link btn-logout">Se déconnecter</a>
        </ng-container>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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

    .nav {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: #636e72;
      font-weight: 500;
      transition: color 0.3s;
      cursor: pointer;
    }

    .nav-link:hover, .nav-link.active {
      color: #e94560;
    }

    .btn-register {
      background: #e94560;
      color: white !important;
      padding: 10px 20px;
      border-radius: 8px;
    }

    .btn-register:hover {
      background: #d63651;
    }

    .btn-logout {
      background: #ef4444;
      color: white !important;
      padding: 10px 20px;
      border-radius: 8px;
    }

    .btn-logout:hover {
      background: #dc2626;
    }

    .cart-link {
      position: relative;
      display: flex;
      align-items: center;
      padding: 8px;
    }

    .cart-link .material-icons {
      font-size: 24px;
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #ef4444;
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

    @media (max-width: 640px) {
      .header {
        padding: 16px 20px;
        flex-direction: column;
        gap: 16px;
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
