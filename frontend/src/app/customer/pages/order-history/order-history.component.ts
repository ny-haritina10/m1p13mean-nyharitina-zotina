import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService, OrderSummary, OrdersResponse } from '../../services/order.service';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { CustomerNavbarComponent } from '../../components/navbar/customer-navbar.component';
import { CustomerFooterComponent } from '../../components/footer/customer-footer.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderCardComponent, CustomerNavbarComponent, CustomerFooterComponent],
  template: `
    <app-customer-navbar></app-customer-navbar>

    <main class="page-container">
      <div class="page-header">
        <h1>Mes Commandes</h1>
        <p class="subtitle">Suivez l'état de vos commandes</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>

      <div *ngIf="!loading && error" class="error-container">
        <span class="material-icons">error_outline</span>
        <p>{{ error }}</p>
        <button (click)="loadOrders()" class="btn-retry">Réessayer</button>
      </div>

      <div *ngIf="!loading && !error && orders.length === 0" class="empty-state">
        <span class="material-icons">receipt_long</span>
        <h2>Aucune commande</h2>
        <p>Vous n'avez pas encore passé de commande.</p>
        <a routerLink="/products" class="btn-browse">Découvrir les produits</a>
      </div>

      <div *ngIf="!loading && !error && orders.length > 0" class="orders-list">
        <app-order-card
          *ngFor="let order of orders"
          [order]="order">
        </app-order-card>

        <div *ngIf="pagination.pages > 1" class="pagination">
          <button
            [disabled]="pagination.page === 1"
            (click)="loadOrders(pagination.page - 1)"
            class="btn-page">
            <span class="material-icons">chevron_left</span>
            Précédent
          </button>

          <span class="page-info">
            Page {{ pagination.page }} sur {{ pagination.pages }}
          </span>

          <button
            [disabled]="pagination.page === pagination.pages"
            (click)="loadOrders(pagination.page + 1)"
            class="btn-page">
            Suivant
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </main>

    <app-customer-footer></app-customer-footer>
  `,
  styles: [`
    .page-container {
      min-height: 60vh;
      padding: 40px 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: #636e72;
      margin: 0;
    }

    .loading-container, .error-container, .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top-color: #e94560;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-container .material-icons, .empty-state .material-icons {
      font-size: 64px;
      color: #b2bec3;
      margin-bottom: 16px;
    }

    .error-container p, .empty-state p {
      color: #636e72;
      margin-bottom: 20px;
    }

    .btn-retry, .btn-browse {
      display: inline-block;
      padding: 12px 24px;
      background: #e94560;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }

    .btn-browse {
      text-decoration: none;
    }

    .empty-state h2 {
      font-size: 24px;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
    }

    .btn-page {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 16px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      color: #1a1a2e;
      transition: all 0.2s;
    }

    .btn-page:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #e94560;
      color: #e94560;
    }

    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-page .material-icons {
      font-size: 20px;
    }

    .page-info {
      color: #636e72;
      font-size: 14px;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private orderService: OrderService = inject(OrderService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  orders: OrderSummary[] = [];
  loading = true;
  error: string | null = null;
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/customer-login']);
      return;
    }
    this.loadOrders();
  }

  loadOrders(page: number = 1): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrders(page).subscribe({
      next: (response: OrdersResponse) => {
        this.orders = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.error || 'Erreur lors du chargement des commandes';
        this.loading = false;
      }
    });
  }
}
