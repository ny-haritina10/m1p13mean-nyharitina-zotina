import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Category } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="categories-container">
      <div class="page-header">
        <div>
          <h1>📂 Catégories</h1>
          <p>Gérez les catégories de vos produits</p>
        </div>
        <button (click)="showAddModal = true" class="btn-primary">
          <span class="material-icons">add</span>
          Nouvelle catégorie
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid" *ngIf="categories.length > 0; else emptyState">
        <div *ngFor="let category of categories" class="category-card">
          <div class="category-header">
            <span class="category-icon">📦</span>
            <h3>{{ category.name }}</h3>
          </div>
          <div class="category-info">
            <span class="product-count">{{ category.productCount || 0 }} produits</span>
          </div>
          <div class="category-actions">
            <button class="btn-sm" (click)="filterByCategory(category.name)">
              <span class="material-icons">visibility</span>
              Voir les produits
            </button>
            <button class="btn-sm delete" *ngIf="category.productCount === 0" (click)="deleteCategory(category._id!)">
              <span class="material-icons">delete</span>
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <span class="material-icons">category</span>
          <h3>Aucune catégorie</h3>
          <p>Les catégories s'afficheront lorsque vous ajouterez des produits</p>
        </div>
      </ng-template>

      <!-- Add Modal -->
      <div *ngIf="showAddModal" class="modal-overlay" (click)="showAddModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nouvelle catégorie</h2>
            <button (click)="showAddModal = false" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nom de la catégorie *</label>
              <input 
                type="text" 
                [(ngModel)]="newCategoryName"
                placeholder="Ex: Vêtements, Accessoires..."
                (keyup.enter)="addCategory()"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="showAddModal = false" class="btn-cancel">Annuler</button>
            <button (click)="addCategory()" class="btn-save">Créer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .category-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .category-icon {
      font-size: 32px;
    }

    .category-header h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    .category-info {
      margin-bottom: 16px;
    }

    .product-count {
      font-size: 14px;
      color: #636e72;
    }

    .category-actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: #faf9f6;
      color: #636e72;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-sm:hover {
      background: #e94560;
      color: white;
      border-color: #e94560;
    }

    .btn-sm.delete:hover {
      background: #e74c3c;
      border-color: #e74c3c;
    }

    .btn-sm .material-icons {
      font-size: 16px;
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
      max-width: 500px;
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

    .form-group input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
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
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  showAddModal = false;
  newCategoryName = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  addCategory(): void {
    if (!this.newCategoryName || this.newCategoryName.length < 3) {
      alert('Le nom de la catégorie doit contenir au moins 3 caractères');
      return;
    }

    this.productService.createCategory(this.newCategoryName).subscribe({
      next: (response) => {
        this.categories.push(response.category);
        this.newCategoryName = '';
        this.showAddModal = false;
      },
      error: (err) => {
        alert(err.error?.error || 'Erreur lors de la création de la catégorie');
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(cat => cat._id !== id);
        },
        error: (err) => {
          alert(err.error?.error || 'Erreur lors de la suppression de la catégorie');
        }
      });
    }
  }

  filterByCategory(category: string): void {
    window.location.href = `/seller/products?category=${encodeURIComponent(category)}`;
  }
}
