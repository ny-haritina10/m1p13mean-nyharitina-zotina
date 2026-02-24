import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SellerOrderService, Order } from '../../services/seller-order.service';
import { OrderStatusBadgeComponent } from '../order-detail/order-status-badge.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, OrderStatusBadgeComponent],
  template: `
    <div class="orders-container">
      <div class="page-header">
        <div>
          <h1>📦 Commandes</h1>
          <p>Gérez les commandes clients</p>
        </div>
        <button routerLink="/seller/orders/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouvelle commande
        </button>
      </div>

      <!-- Status Summary Cards -->
      <div class="status-cards" *ngIf="statusCounts">
        <div class="status-card pending" (click)="filterByStatus('pending')">
          <div class="card-value">{{ statusCounts['pending'] || 0 }}</div>
          <div class="card-label">En attente</div>
        </div>
        <div class="status-card validated" (click)="filterByStatus('validated')">
          <div class="card-value">{{ statusCounts['validated'] || 0 }}</div>
          <div class="card-label">Validées</div>
        </div>
        <div class="status-card preparing" (click)="filterByStatus('preparing')">
          <div class="card-value">{{ statusCounts['preparing'] || 0 }}</div>
          <div class="card-label">En préparation</div>
        </div>
        <div class="status-card ready" (click)="filterByStatus('ready')">
          <div class="card-value">{{ statusCounts['ready'] || 0 }}</div>
          <div class="card-label">Prêtes</div>
        </div>
        <div class="status-card delivered" (click)="filterByStatus('delivered')">
          <div class="card-value">{{ statusCounts['delivered'] || 0 }}</div>
          <div class="card-label">Livrées</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>Statut</label>
          <select [(ngModel)]="filters.status" (ngModelChange)="loadOrders()">
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="validated">Validée</option>
            <option value="preparing">En préparation</option>
            <option value="ready">Prête</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Date début</label>
          <input type="date" [(ngModel)]="filters.startDate" (ngModelChange)="loadOrders()" />
        </div>

        <div class="filter-group">
          <label>Date fin</label>
          <input type="date" [(ngModel)]="filters.endDate" (ngModelChange)="loadOrders()" />
        </div>

        <button (click)="clearFilters()" class="btn-clear">
          <span class="material-icons">clear_all</span>
          Effacer filtres
        </button>
      </div>

      <!-- Orders Table -->
      <div class="table-container" *ngIf="orders.length > 0; else emptyState">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Date</th>
              <th>Produits</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td class="order-number">{{ order.orderNumber }}</td>
              <td>
                <div class="customer-info">
                  <div class="customer-name">{{ order.customer?.name }}</div>
                  <div class="customer-phone">{{ order.customer?.phone }}</div>
                </div>
              </td>
              <td>{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <span class="products-count">{{ order.products.length }} produit(s)</span>
              </td>
              <td class="amount">{{ order.totalAmount | number:'1.0-0' }} Ar</td>
              <td>
                <app-order-status-badge [status]="order.orderStatus"></app-order-status-badge>
              </td>
              <td>
                <div class="actions">
                  <a [routerLink]="['/seller/orders', order._id]" class="btn-icon" title="Voir">
                    <span class="material-icons">visibility</span>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span class="material-icons">shopping_bag</span>
          <h3>Aucune commande</h3>
          <p>Les commandes apparaîtront ici</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #d63651;
      transform: translateY(-2px);
    }

    .status-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .status-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      border-left: 4px solid #e0e0e0;
    }

    .status-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0,0,0,0.12);
    }

    .status-card.pending { border-left-color: #f39c12; }
    .status-card.validated { border-left-color: #3498db; }
    .status-card.preparing { border-left-color: #9b59b6; }
    .status-card.ready { border-left-color: #27ae60; }
    .status-card.delivered { border-left-color: #1abc9c; }

    .status-card .card-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .status-card .card-label {
      font-size: 13px;
      color: #636e72;
    }

    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-group label {
      font-size: 13px;
      font-weight: 500;
      color: #636e72;
    }

    .filter-group input,
    .filter-group select {
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 14px;
      background: white;
      transition: border-color 0.3s;
    }

    .filter-group input:focus,
    .filter-group select:focus {
      outline: none;
      border-color: #e94560;
    }

    .btn-clear {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-clear:hover {
      background: #e0e0e0;
    }

    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }

    .orders-table th {
      background: #faf9f6;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .orders-table td {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }

    .order-number {
      font-weight: 600;
      color: #667eea;
      font-size: 14px;
    }

    .customer-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .customer-name {
      font-weight: 600;
      color: #1a1a2e;
    }

    .customer-phone {
      font-size: 13px;
      color: #636e72;
    }

    .products-count {
      display: inline-block;
      padding: 6px 12px;
      background: #faf9f6;
      color: #636e72;
      border-radius: 20px;
      font-size: 12px;
    }

    .amount {
      font-weight: 700;
      color: #1a1a2e;
      font-size: 15px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border: none;
      background: #faf9f6;
      color: #636e72;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }

    .btn-icon:hover {
      background: #667eea;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .empty-state .material-icons {
      font-size: 72px;
      color: #b2bec3;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #636e72;
      margin-bottom: 24px;
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  statusCounts: { [key: string]: number } = {};
  filters: any = {
    status: '',
    startDate: '',
    endDate: ''
  };

  constructor(private orderService: SellerOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(this.filters).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.statusCounts = response.statusCounts;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
  }

  filterByStatus(status: string): void {
    this.filters.status = status;
    this.loadOrders();
  }

  clearFilters(): void {
    this.filters = { status: '', startDate: '', endDate: '' };
    this.loadOrders();
  }
}
