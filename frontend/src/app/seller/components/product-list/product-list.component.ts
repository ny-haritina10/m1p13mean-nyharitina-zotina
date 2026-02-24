import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-container">
      <div class="page-header">
        <div>
          <h1>📦 Catalogue des Produits</h1>
          <p>Gérez votre catalogue de produits</p>
        </div>
        <button routerLink="/seller/products/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouveau produit
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="filters.search"
            (ngModelChange)="applyFilters()"
            placeholder="Rechercher un produit..."
          />
        </div>
        
        <select [(ngModel)]="filters.category" (ngModelChange)="applyFilters()">
          <option value="">Toutes catégories</option>
          <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
        </select>

        <select [(ngModel)]="filters.status" (ngModelChange)="applyFilters()">
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="out_of_stock">Rupture de stock</option>
        </select>
      </div>

      <!-- Products Table -->
      <div class="products-table-container" *ngIf="products.length > 0; else emptyState">
        <table class="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>
                <div class="product-image">
                  <img *ngIf="product.images?.[0]" [src]="product.images[0]" [alt]="product.name" />
                  <span *ngIf="!product.images?.[0]" class="material-icons">image</span>
                </div>
              </td>
              <td>
                <div class="product-name">{{ product.name }}</div>
                <div *ngIf="product.description" class="product-desc">{{ product.description | slice:0:50 }}...</div>
              </td>
              <td>
                <span class="category-badge">{{ product.category }}</span>
              </td>
              <td class="price">{{ product.price | number:'1.0-0' }} Ar</td>
              <td>
                <div class="stock-display" [class.low]="product.stock <= product.lowStockThreshold">
                  {{ product.stock }}
                  <span *ngIf="product.stock <= product.lowStockThreshold" class="low-stock-indicator">!</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="product.status">
                  {{ getStatusLabel(product.status) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button routerLink="/seller/products/{{ product._id }}/edit" class="btn-icon" title="Modifier">
                    <span class="material-icons">edit</span>
                  </button>
                  <button (click)="deleteProduct(product._id!)" class="btn-icon delete" title="Supprimer">
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
          <span class="material-icons">inventory_2</span>
          <h3>Aucun produit</h3>
          <p>Commencez par ajouter votre premier produit</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .product-container {
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
      box-shadow: 0 4px 16px rgba(233, 69, 96, 0.3);
    }

    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      position: relative;
    }

    .search-box .material-icons {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #b2bec3;
    }

    .search-box input {
      width: 100%;
      padding: 14px 16px 14px 48px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .search-box input:focus {
      outline: none;
      border-color: #e94560;
    }

    .filters-bar select {
      padding: 14px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      transition: border-color 0.3s;
    }

    .filters-bar select:focus {
      outline: none;
      border-color: #e94560;
    }

    .products-table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      background: #faf9f6;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .products-table td {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }

    .product-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      background: #faf9f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-image .material-icons {
      color: #b2bec3;
      font-size: 28px;
    }

    .product-name {
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 4px;
    }

    .product-desc {
      font-size: 13px;
      color: #636e72;
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

    .price {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 15px;
    }

    .stock-display {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 32px;
      background: #e8f5e9;
      color: #27ae60;
      border-radius: 8px;
      font-weight: 600;
      position: relative;
    }

    .stock-display.low {
      background: #fff3e0;
      color: #f39c12;
    }

    .low-stock-indicator {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      background: #e74c3c;
      color: white;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 700;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.active {
      background: #e8f5e9;
      color: #27ae60;
    }

    .status-badge.inactive {
      background: #f5f5f5;
      color: #636e72;
    }

    .status-badge.out_of_stock {
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filters: any = {
    search: '',
    category: '',
    status: ''
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
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

  applyFilters(): void {
    this.loadProducts();
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      active: 'Actif',
      inactive: 'Inactif',
      out_of_stock: 'Rupture'
    };
    return labels[status] || status;
  }

  deleteProduct(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }
}
