import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StockMovementService, StockMovement } from '../../services/stock-movement.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-stock-movement',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="movement-container">
      <div class="page-header">
        <div>
          <h1>🔄 Mouvements de Stock</h1>
          <p>Suivez les entrées et sorties de stock</p>
        </div>
        <button (click)="showAddModal = true" class="btn-primary">
          <span class="material-icons">add</span>
          Nouveau mouvement
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>Date début</label>
          <input type="date" [(ngModel)]="filters.startDate" (ngModelChange)="loadMovements()" />
        </div>

        <div class="filter-group">
          <label>Date fin</label>
          <input type="date" [(ngModel)]="filters.endDate" (ngModelChange)="loadMovements()" />
        </div>

        <div class="filter-group">
          <label>Type</label>
          <select [(ngModel)]="filters.type" (ngModelChange)="loadMovements()">
            <option value="">Tous les types</option>
            <option value="entry">Entrée</option>
            <option value="out">Sortie</option>
          </select>
        </div>
      </div>

      <!-- Movements Table -->
      <div class="table-container" *ngIf="movements.length > 0; else emptyState">
        <table class="movement-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Motif</th>
              <th>Stock après</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movement of movements">
              <td>{{ movement.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <div class="product-info">
                  <div class="product-image" *ngIf="movement.product?.images?.[0]">
                    <img [src]="movement.product.images![0]" [alt]="movement.product.name" />
                  </div>
                  <div class="product-image" *ngIf="!movement.product?.images?.[0]">
                    <span class="material-icons">image</span>
                  </div>
                  <span class="product-name">{{ movement.product?.name }}</span>
                </div>
              </td>
              <td>
                <span class="type-badge" [class]="movement.type">
                  {{ movement.type === 'entry' ? '📥 Entrée' : '📤 Sortie' }}
                </span>
              </td>
              <td>
                <span class="quantity" [class]="movement.type">
                  {{ movement.type === 'entry' ? '+' : '-' }}{{ movement.quantity }}
                </span>
              </td>
              <td>{{ getReasonLabel(movement.reason) }}</td>
              <td class="stock-after">{{ movement.stockAfter }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span class="material-icons">swap_horiz</span>
          <h3>Aucun mouvement</h3>
          <p>Enregistrez un mouvement de stock pour commencer</p>
        </div>
      </ng-template>

      <!-- Add Modal -->
      <div *ngIf="showAddModal" class="modal-overlay" (click)="showAddModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nouveau mouvement de stock</h2>
            <button (click)="showAddModal = false" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Type de mouvement *</label>
                <select [(ngModel)]="newMovement.type">
                  <option value="entry">Entrée de stock</option>
                  <option value="out">Sortie de stock</option>
                </select>
              </div>

              <div class="form-group">
                <label>Produit *</label>
                <select [(ngModel)]="newMovement.productId">
                  <option value="">Sélectionner un produit</option>
                  <option *ngFor="let product of products" [value]="product._id">
                    {{ product.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Quantité *</label>
              <input 
                type="number" 
                [(ngModel)]="newMovement.quantity"
                min="1"
                placeholder="10"
              />
            </div>

            <div class="form-group">
              <label>Motif *</label>
              <select [(ngModel)]="newMovement.reason">
                <option value="">Sélectionner un motif</option>
                <option value="purchase">Achat fournisseur</option>
                <option value="return">Retour client</option>
                <option value="adjustment">Ajustement inventaire</option>
                <option value="sale">Vente</option>
                <option value="damage">Produit endommagé</option>
                <option value="loss">Perte</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="form-group">
              <label>Date *</label>
              <input 
                type="datetime-local" 
                [(ngModel)]="newMovement.date"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="showAddModal = false" class="btn-cancel">Annuler</button>
            <button (click)="addMovement()" class="btn-save">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movement-container {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 16px;
      border-left: 4px solid #e0e0e0;
    }

    .stat-card.entry { border-left-color: #27ae60; }
    .stat-card.out { border-left-color: #e74c3c; }

    .stat-icon {
      font-size: 36px;
    }

    .stat-card.entry .stat-icon { color: #27ae60; }
    .stat-card.out .stat-icon { color: #e74c3c; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .stat-label {
      font-size: 13px;
      color: #636e72;
    }

    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .movement-table {
      width: 100%;
      border-collapse: collapse;
    }

    .movement-table th {
      background: #faf9f6;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .movement-table td {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      background: #faf9f6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-image .material-icons {
      color: #b2bec3;
      font-size: 24px;
    }

    .product-name {
      font-weight: 600;
      color: #1a1a2e;
    }

    .type-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .type-badge.entry {
      background: #e8f5e9;
      color: #27ae60;
    }

    .type-badge.out {
      background: #ffebee;
      color: #e74c3c;
    }

    .quantity {
      font-weight: 700;
      font-size: 15px;
    }

    .quantity.entry {
      color: #27ae60;
    }

    .quantity.out {
      color: #e74c3c;
    }

    .stock-after {
      font-weight: 600;
      color: #667eea;
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

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 16px;
      padding: 32px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      color: #1a1a2e;
      margin: 0;
    }

    .btn-close {
      width: 36px;
      height: 36px;
      border: none;
      background: #f0f0f0;
      color: #636e72;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close:hover {
      background: #e0e0e0;
    }

    .modal-body {
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #636e72;
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #e94560;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel {
      padding: 12px 24px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-save {
      padding: 12px 24px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class StockMovementComponent implements OnInit {
  movements: StockMovement[] = [];
  products: any[] = [];
  showAddModal = false;
  filters: any = {
    startDate: '',
    endDate: '',
    type: ''
  };

  newMovement: any = {
    type: 'entry',
    productId: '',
    quantity: 1,
    reason: '',
    date: new Date().toISOString().slice(0, 16)
  };

  constructor(
    private stockMovementService: StockMovementService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadMovements();
    this.loadProducts();
  }

  loadMovements(): void {
    console.log('🔍 Loading movements with filters:', this.filters);
    this.stockMovementService.getMovements(this.filters).subscribe({
      next: (response) => {
        console.log('✅ Movements loaded:', response.movements.length);
        this.movements = response.movements;
      },
      error: (err) => {
        console.error('❌ Error loading movements:', err);
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  getReasonLabel(reason: string): string {
    const labels: any = {
      purchase: 'Achat fournisseur',
      return: 'Retour client',
      adjustment: 'Ajustement inventaire',
      sale: 'Vente',
      damage: 'Produit endommagé',
      loss: 'Perte',
      other: 'Autre'
    };
    return labels[reason] || reason;
  }

  addMovement(): void {
    if (!this.newMovement.productId || !this.newMovement.quantity || !this.newMovement.reason) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const movementData = {
      productId: this.newMovement.productId,
      type: this.newMovement.type,
      quantity: Number(this.newMovement.quantity),
      reason: this.newMovement.reason,
      notes: ''
    };

    this.stockMovementService.createMovement(movementData).subscribe({
      next: () => {
        this.showAddModal = false;
        this.loadMovements();
        this.newMovement = {
          type: 'entry',
          productId: '',
          quantity: 1,
          reason: '',
          date: new Date().toISOString().slice(0, 16)
        };
      },
      error: (err) => {
        alert(err.error?.error || 'Erreur lors de l\'enregistrement du mouvement');
      }
    });
  }
}