import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../../services/product.service';
import { StockMovementService } from '../../services/stock-movement.service';

interface ProductWithMovements extends Product {
  initialStock?: number;
  totalEntries?: number;
  totalOuts?: number;
}

@Component({
  selector: 'app-stock-status',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="stock-container">
      <div class="page-header">
        <div>
          <h1>📊 État des Stocks</h1>
          <p>Visualisez l'état de vos stocks en temps réel</p>
        </div>
        <button routerLink="/seller/products/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouveau produit
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>Date</label>
          <input type="date" [(ngModel)]="filters.date" (ngModelChange)="loadProducts()" />
        </div>
        
        <div class="filter-group">
          <label>Catégorie</label>
          <select [(ngModel)]="filters.category" (ngModelChange)="loadProducts()">
            <option value="">Toutes catégories</option>
            <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>État du stock</label>
          <select [(ngModel)]="filters.stockStatus" (ngModelChange)="loadProducts()">
            <option value="">Tous les états</option>
            <option value="in_stock">En stock</option>
            <option value="low">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="table-container" *ngIf="products.length > 0; else emptyState">
        <table class="stock-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock Initial</th>
              <th>Somme Entrée</th>
              <th>Somme Sortie</th>
              <th>Stock Actuel</th>
              <th>Seuil d'alerte</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>
                <div class="product-info">
                  <div class="product-image" *ngIf="product.images?.[0]">
                    <img [src]="product.images[0]" [alt]="product.name" />
                  </div>
                  <div class="product-image" *ngIf="!product.images?.[0]">
                    <span class="material-icons">image</span>
                  </div>
                  <span class="product-name">{{ product.name }}</span>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ product.category }}</span>
              </td>
              <td>{{ product.initialStock || 0 }}</td>
              <td class="entry">{{ product.totalEntries || 0 }}</td>
              <td class="out">{{ product.totalOuts || 0 }}</td>
              <td class="stock-current" [class.low]="product.stock <= product.lowStockThreshold">
                {{ product.stock }}
              </td>
              <td>{{ product.lowStockThreshold }}</td>
              <td>
                <span class="status-badge" [class]="getStockStatus(product)">
                  {{ getStockStatusLabel(product) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span class="material-icons">inventory_2</span>
          <h3>Aucun produit</h3>
          <p>Ajoutez des produits pour voir leur état de stock</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .stock-container {
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
      text-decoration: none;
    }

    .btn-primary:hover {
      background: #d63651;
      transform: translateY(-2px);
    }

    .btn-secondary:hover {
      background: #5568d3;
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

    .stat-card.success { border-left-color: #27ae60; }
    .stat-card.warning { border-left-color: #f39c12; }
    .stat-card.danger { border-left-color: #e74c3c; }
    .stat-card.info { border-left-color: #667eea; }

    .stat-icon {
      font-size: 36px;
    }

    .stat-card.success .stat-icon { color: #27ae60; }
    .stat-card.warning .stat-icon { color: #f39c12; }
    .stat-card.danger .stat-icon { color: #e74c3c; }
    .stat-card.info .stat-icon { color: #667eea; }

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

    .stock-table {
      width: 100%;
      border-collapse: collapse;
    }

    .stock-table th {
      background: #faf9f6;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stock-table td {
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

    .category-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #667eea;
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .entry {
      color: #27ae60;
      font-weight: 600;
    }

    .out {
      color: #e74c3c;
      font-weight: 600;
    }

    .stock-current {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 50px;
      padding: 6px 12px;
      background: #e8f5e9;
      color: #27ae60;
      border-radius: 8px;
      font-weight: 600;
    }

    .stock-current.low {
      background: #fff3e0;
      color: #f39c12;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.in_stock {
      background: #e8f5e9;
      color: #27ae60;
    }

    .status-badge.low {
      background: #fff3e0;
      color: #f39c12;
    }

    .status-badge.out_of_stock {
      background: #ffebee;
      color: #e74c3c;
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
export class StockStatusComponent implements OnInit {
  products: ProductWithMovements[] = [];
  categories: Category[] = [];
  filters: any = {
    date: new Date().toISOString().split('T')[0],
    category: '',
    stockStatus: ''
  };

  constructor(
    private productService: ProductService,
    private stockMovementService: StockMovementService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.products.map(product => ({
          ...product,
          initialStock: 0,
          totalEntries: 0,
          totalOuts: 0
        }));
        this.loadMovementStats();
      }
    });
  }

  loadMovementStats(): void {
    // Load all movements (no date filter)
    this.stockMovementService.getStatsByProduct('', '').subscribe({
      next: (response) => {
        const statsMap = new Map(response.stats.map(s => [s.productId, s]));
        
        this.products = this.products.map(product => {
          const stats = statsMap.get(product._id!);
          const totalEntries = stats?.totalEntries || 0;
          const totalOuts = stats?.totalOuts || 0;
          
          return {
            ...product,
            initialStock: product.stock, // Le stock initial est celui de la base
            totalEntries,
            totalOuts,
            stock: product.stock + totalEntries - totalOuts // Stock actuel calculé
          };
        });
      },
      error: (err) => {
        console.error('Error loading movement stats:', err);
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      }
    });
  }

  getStockStatus(product: Product): string {
    if (product.stock === 0) return 'out_of_stock';
    if (product.stock <= product.lowStockThreshold) return 'low';
    return 'in_stock';
  }

  getStockStatusLabel(product: Product): string {
    const status = this.getStockStatus(product);
    const labels: any = {
      in_stock: 'En stock',
      low: 'Stock faible',
      out_of_stock: 'Rupture'
    };
    return labels[status];
  }
}
