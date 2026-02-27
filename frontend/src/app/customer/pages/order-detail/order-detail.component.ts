import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService, OrderDetail, OrderDetailResponse } from '../../services/order.service';
import { OrderStatusBadgeComponent } from '../../components/order-status-badge/order-status-badge.component';
import { CustomerNavbarComponent } from '../../components/navbar/customer-navbar.component';
import { CustomerFooterComponent } from '../../components/footer/customer-footer.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderStatusBadgeComponent, CustomerNavbarComponent, CustomerFooterComponent],
  template: `
    <app-customer-navbar></app-customer-navbar>
    
    <main class="page-container">
      <div class="breadcrumb">
        <a routerLink="/orders">Mes commandes</a>
        <span class="material-icons">chevron_right</span>
        <span>{{ order?.orderNumber }}</span>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des détails...</p>
      </div>

      <div *ngIf="!loading && error" class="error-container">
        <span class="material-icons">error_outline</span>
        <p>{{ error }}</p>
        <button (click)="loadOrder()" class="btn-retry">Réessayer</button>
      </div>

      <div *ngIf="!loading && !error && order" class="order-detail">
        <div class="order-header">
          <div class="order-title">
            <h1>Commande {{ order.orderNumber }}</h1>
            <app-order-status-badge [status]="order.globalStatus"></app-order-status-badge>
          </div>
          <p class="order-date">
            Passée le {{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}
          </p>
        </div>

        <div class="order-grid">
          <div class="order-items-section">
            <h2>Produits</h2>
            
            <div *ngFor="let seller of sellersGrouped" class="seller-group">
              <div class="seller-header">
                <div class="seller-info">
                  <span class="material-icons">store</span>
                  <span class="seller-name">{{ seller.boutiqueName }}</span>
                </div>
                <div class="seller-status">
                  <span class="status-label">Statut:</span>
                  <app-order-status-badge [status]="seller.status"></app-order-status-badge>
                </div>
              </div>
              
              <div class="items-list">
                <div *ngFor="let item of seller.items" class="item-row">
                  <div class="item-image" *ngIf="item.productImage">
                    <img [src]="item.productImage" [alt]="item.productName">
                  </div>
                  <div class="item-image placeholder" *ngIf="!item.productImage">
                    <span class="material-icons">image</span>
                  </div>
                  
                  <div class="item-details">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-quantity">Qty: {{ item.quantity }} × {{ item.unitPrice | number:'1.0-0' }} Ar</span>
                  </div>
                  
                  <div class="item-subtotal">
                    {{ item.subtotal | number:'1.0-0' }} Ar
                  </div>
                </div>
              </div>
              
              <div class="seller-subtotal">
                <span>Sous-total {{ seller.boutiqueName }}</span>
                <span>{{ seller.subtotal | number:'1.0-0' }} Ar</span>
              </div>
            </div>
          </div>

          <div class="order-summary-section">
            <h2>Résumé</h2>
            
            <div class="summary-card">
              <div class="summary-row">
                <span>Total</span>
                <span class="total-amount">{{ order.totalAmount | number:'1.0-0' }} Ar</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-details">
                <div class="detail-row">
                  <span class="material-icons">payment</span>
                  <span>Paiement</span>
                  <span class="detail-value">{{ getPaymentMethodLabel(order.paymentMethod) }}</span>
                </div>
                <div class="detail-row">
                  <span class="material-icons">receipt</span>
                  <span>Statut paiement</span>
                  <span class="detail-value payment-status" [class.paid]="order.paymentStatus === 'paid'">
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </span>
                </div>
              </div>

              <div *ngIf="order.deliveryAddress" class="summary-divider"></div>
              
              <div *ngIf="order.deliveryAddress" class="delivery-address">
                <h3>
                  <span class="material-icons">local_shipping</span>
                  Adresse de livraison
                </h3>
                <p *ngIf="order.deliveryAddress.street">{{ order.deliveryAddress.street }}</p>
                <p *ngIf="order.deliveryAddress.city">{{ order.deliveryAddress.city }}</p>
                <p *ngIf="order.deliveryAddress.phone">{{ order.deliveryAddress.phone }}</p>
              </div>

              <div *ngIf="order.customerNotes" class="summary-divider"></div>
              
              <div *ngIf="order.customerNotes" class="customer-notes">
                <h3>
                  <span class="material-icons">note</span>
                  Notes
                </h3>
                <p>{{ order.customerNotes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-customer-footer></app-customer-footer>
  `,
  styles: [`
    .page-container {
      min-height: 60vh;
      padding: 20px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 14px;
    }

    .breadcrumb a {
      color: #636e72;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      color: #e94560;
    }

    .breadcrumb .material-icons {
      font-size: 18px;
      color: #b2bec3;
    }

    .breadcrumb span:last-child {
      color: #1a1a2e;
      font-weight: 500;
    }

    .loading-container, .error-container {
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

    .error-container .material-icons {
      font-size: 64px;
      color: #b2bec3;
      margin-bottom: 16px;
    }

    .btn-retry {
      padding: 12px 24px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .order-header {
      margin-bottom: 32px;
    }

    .order-title {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .order-title h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }

    .order-date {
      color: #636e72;
      margin: 0;
    }

    .order-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 32px;
    }

    .order-items-section h2, .order-summary-section h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 20px 0;
    }

    .seller-group {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .seller-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .seller-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .seller-info .material-icons {
      color: #e94560;
      font-size: 20px;
    }

    .seller-name {
      font-weight: 600;
      color: #1a1a2e;
    }

    .seller-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-label {
      font-size: 13px;
      color: #636e72;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-image.placeholder {
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-image.placeholder .material-icons {
      color: #b2bec3;
      font-size: 24px;
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-name {
      font-weight: 500;
      color: #1a1a2e;
    }

    .item-quantity {
      font-size: 13px;
      color: #636e72;
    }

    .item-subtotal {
      font-weight: 600;
      color: #1a1a2e;
    }

    .seller-subtotal {
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      font-weight: 600;
      color: #1a1a2e;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .summary-row span:first-child {
      font-size: 16px;
      color: #636e72;
    }

    .total-amount {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .summary-divider {
      height: 1px;
      background: #f0f0f0;
      margin: 16px 0;
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .detail-row .material-icons {
      font-size: 18px;
      color: #b2bec3;
    }

    .detail-row span:nth-child(2) {
      color: #636e72;
      flex: 1;
    }

    .detail-value {
      font-weight: 500;
      color: #1a1a2e;
    }

    .payment-status.paid {
      color: #059669;
    }

    .delivery-address h3, .customer-notes h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 12px 0;
    }

    .delivery-address h3 .material-icons, .customer-notes h3 .material-icons {
      font-size: 18px;
      color: #e94560;
    }

    .delivery-address p, .customer-notes p {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #636e72;
    }

    @media (max-width: 900px) {
      .order-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private orderService: OrderService = inject(OrderService);
  private authService: AuthService = inject(AuthService);

  order: OrderDetail | null = null;
  loading = true;
  error: string | null = null;
  sellersGrouped: any[] = [];

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/customer-login']);
      return;
    }
    this.loadOrder();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!orderId) {
      this.error = 'ID de commande invalide';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.orderService.getOrderDetail(orderId).subscribe({
      next: (response: OrderDetailResponse) => {
        this.order = response.data;
        this.groupSellers();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors du chargement de la commande';
        this.loading = false;
      }
    });
  }

  groupSellers(): void {
    if (!this.order) return;

    const grouped = new Map<string, { boutiqueName: string; status: string; subtotal: number; items: any[] }>();

    this.order.items.forEach(item => {
      const sellerData = this.order!.sellers.find(s => {
        return this.order!.items.some(item => true);
      });
      
      const sellerInfo = this.order!.sellers[0];
      if (!sellerInfo) return;
      
      const key = sellerInfo.sellerId;
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          boutiqueName: sellerInfo.boutiqueName,
          status: sellerInfo.status,
          subtotal: sellerInfo.subtotal,
          items: []
        });
      }
      
      grouped.get(key)!.items.push(item);
    });

    this.sellersGrouped = Array.from(grouped.values());
  }

  getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      'cash': 'Espèces',
      'mobile_money': 'Mobile Money',
      'card': 'Carte'
    };
    return labels[method] || method;
  }

  getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'paid': 'Payé',
      'refunded': 'Remboursé'
    };
    return labels[status] || status;
  }
}
