import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaleService, Sale } from '../../services/sale.service';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="sales-container">
      <div class="page-header">
        <div>
          <h1>🛒 Ventes</h1>
          <p>Historique des ventes et enregistrements</p>
        </div>
        <button routerLink="/seller/sales/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouvelle vente
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>Date début</label>
          <input type="date" [(ngModel)]="filters.startDate" (ngModelChange)="loadSales()" />
        </div>

        <div class="filter-group">
          <label>Date fin</label>
          <input type="date" [(ngModel)]="filters.endDate" (ngModelChange)="loadSales()" />
        </div>

        <div class="filter-group">
          <label>Statut paiement</label>
          <select [(ngModel)]="filters.paymentStatus" (ngModelChange)="loadSales()">
            <option value="">Tous</option>
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="partial">Partiel</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Méthode</label>
          <select [(ngModel)]="filters.paymentMethod" (ngModelChange)="loadSales()">
            <option value="">Toutes</option>
            <option value="cash">Espèces</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="card">Carte</option>
            <option value="mixed">Mixte</option>
          </select>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards" *ngIf="sales.length > 0">
        <div class="summary-card">
          <div class="card-icon">💰</div>
          <div class="card-info">
            <div class="card-value">{{ totalRevenue | number:'1.0-0' }} Ar</div>
            <div class="card-label">Chiffre d'affaires</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">📦</div>
          <div class="card-info">
            <div class="card-value">{{ totalSales }}</div>
            <div class="card-label">Ventes</div>
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="table-container" *ngIf="sales.length > 0; else emptyState">
        <table class="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Produits</th>
              <th>Montant Total</th>
              <th>Méthode</th>
              <th>Statut</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sale of sales">
              <td>{{ sale.saleDate | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <div class="products-count">
                  <span class="material-icons">shopping_bag</span>
                  {{ sale.products.length }} produit(s)
                </div>
              </td>
              <td class="amount">{{ sale.totalAmount | number:'1.0-0' }} Ar</td>
              <td>
                <span class="payment-method">{{ getPaymentMethodLabel(sale.paymentMethod) }}</span>
              </td>
              <td>
                <span class="status-badge" [class]="sale.paymentStatus">
                  {{ getPaymentStatusLabel(sale.paymentStatus) }}
                </span>
              </td>
              <td class="description-cell">
                <span *ngIf="sale.notes" class="description-text">{{ sale.notes | slice:0:50 }}{{ sale.notes && sale.notes.length > 50 ? '...' : '' }}</span>
                <span *ngIf="!sale.notes" class="no-description">-</span>
              </td>
              <td>
                <div class="actions">
                  <button (click)="deleteSale(sale._id!)" class="btn-icon delete" title="Supprimer">
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span class="material-icons">receipt_long</span>
          <h3>Aucune vente</h3>
          <p>Enregistrez votre première vente</p>
          <button routerLink="/seller/sales/create" class="btn-primary">
            <span class="material-icons">add</span>
            Nouvelle vente
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .sales-container {
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

    .page-header p {
      color: #636e72;
      font-size: 14px;
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

    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
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

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .card-icon {
      font-size: 36px;
    }

    .card-info {
      display: flex;
      flex-direction: column;
    }

    .card-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .card-label {
      font-size: 13px;
      color: #636e72;
    }

    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .sales-table {
      width: 100%;
      border-collapse: collapse;
    }

    .sales-table th {
      background: #faf9f6;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sales-table td {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }

    .products-count {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #636e72;
    }

    .products-count .material-icons {
      font-size: 18px;
    }

    .amount {
      font-weight: 700;
      color: #1a1a2e;
      font-size: 15px;
    }

    .payment-method {
      display: inline-block;
      padding: 6px 12px;
      background: #667eea;
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.paid {
      background: #e8f5e9;
      color: #27ae60;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f39c12;
    }

    .status-badge.partial {
      background: #ffebee;
      color: #e74c3c;
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
    }

    .btn-icon:hover {
      background: #e94560;
      color: white;
    }

    .btn-icon.delete:hover {
      background: #e74c3c;
    }

    .description-cell {
      max-width: 200px;
    }

    .description-text {
      color: #636e72;
      font-size: 13px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-description {
      color: #b2bec3;
      font-style: italic;
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
export class SaleListComponent implements OnInit {
  sales: Sale[] = [];
  filters: any = {
    startDate: '',
    endDate: '',
    paymentStatus: '',
    paymentMethod: ''
  };

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getSales(this.filters).subscribe({
      next: (response) => {
        this.sales = response.sales;
      },
      error: (err) => {
        console.error('Error loading sales:', err);
      }
    });
  }

  get totalRevenue(): number {
    return this.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  }

  get totalSales(): number {
    return this.sales.length;
  }

  getPaymentMethodLabel(method: string): string {
    const labels: any = {
      cash: 'Espèces',
      mobile_money: 'Mobile Money',
      card: 'Carte',
      mixed: 'Mixte'
    };
    return labels[method] || method;
  }

  getPaymentStatusLabel(status: string): string {
    const labels: any = {
      paid: 'Payé',
      pending: 'En attente',
      partial: 'Partiel'
    };
    return labels[status] || status;
  }

  deleteSale(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      this.saleService.deleteSale(id).subscribe({
        next: () => {
          this.loadSales();
        },
        error: (err) => {
          console.error('Error deleting sale:', err);
        }
      });
    }
  }
}
