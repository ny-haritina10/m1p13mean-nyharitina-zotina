import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PromotionService } from '../../services/promotion.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-container">
      <div class="page-header">
        <div>
          <h1>🏷️ Nouvelle Promotion</h1>
          <p>Créez une promotion pour un produit</p>
        </div>
        <button type="button" (click)="cancel()" class="btn-cancel">
          <span class="material-icons">close</span>
          Annuler
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="promo-form">
        <!-- Product Selection -->
        <div class="form-section">
          <h2>📦 Produit</h2>
          <div class="form-group">
            <label>Produit *</label>
            <select [(ngModel)]="selectedProductId" name="productId" required (change)="onProductSelect()">
              <option value="">Sélectionner un produit</option>
              <option *ngFor="let p of products" [value]="p._id">
                {{ p.name }} - {{ p.price | number:'1.0-0' }} Ar (Stock: {{ p.stock }})
              </option>
            </select>
          </div>

          <!-- Product Info Display -->
          <div class="product-info-card" *ngIf="selectedProduct">
            <div class="info-row">
              <span class="label">Prix normal :</span>
              <span class="value">{{ selectedProduct.price | number:'1.0-0' }} Ar</span>
            </div>
            <div class="info-row" *ngIf="selectedProduct.isPromotional && selectedProduct.promotionalPrice">
              <span class="label">Prix promo actuel :</span>
              <span class="value promo">{{ selectedProduct.promotionalPrice | number:'1.0-0' }} Ar</span>
            </div>
          </div>
        </div>

        <!-- Promotion Details -->
        <div class="form-section">
          <h2>💰 Détails de la promotion</h2>

          <div class="form-group">
            <label>Prix promotionnel (Ar) *</label>
            <input
              type="number"
              [(ngModel)]="promotion.promotionalPrice"
              name="promotionalPrice"
              required
              min="1"
              [max]="selectedProduct?.price || 0"
              placeholder="40000"
            />
            <span class="field-note">Doit être inférieur au prix normal</span>
          </div>

          <div class="discount-preview" *ngIf="promotion.promotionalPrice && selectedProduct">
            <div class="discount-info">
              <span class="discount-label">Réduction :</span>
              <span class="discount-value">{{ calculateDiscount() }}%</span>
            </div>
            <div class="savings-info">
              <span class="savings-label">Économie client :</span>
              <span class="savings-value">{{ selectedProduct.price - promotion.promotionalPrice | number:'1.0-0' }} Ar</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date de début</label>
              <input
                type="date"
                [(ngModel)]="promotion.startDate"
                name="startDate"
                [min]="today"
              />
              <span class="field-note">Par défaut : aujourd'hui</span>
            </div>

            <div class="form-group">
              <label>Date de fin</label>
              <input
                type="date"
                [(ngModel)]="promotion.endDate"
                name="endDate"
                [min]="promotion.startDate || today"
              />
              <span class="field-note">Optionnel - laisser vide pour durée illimitée</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" (click)="cancel()" class="btn-cancel-large">
            <span class="material-icons">close</span>
            Annuler
          </button>
          <button type="submit" class="btn-save" [disabled]="!isValid()">
            <span *ngIf="!isLoading">
              ✅ Créer la promotion
            </span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
        </div>
      </form>

      <div *ngIf="message" class="message" [class.error]="isError">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 800px;
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

    .btn-cancel {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .promo-form {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .form-section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 20px;
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

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .field-note {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: #636e72;
    }

    .product-info-card {
      background: #faf9f6;
      padding: 20px;
      border-radius: 12px;
      margin-top: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }

    .info-row:not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }

    .label {
      color: #636e72;
    }

    .value {
      font-weight: 600;
      color: #1a1a2e;
    }

    .value.promo {
      color: #e94560;
    }

    .discount-preview {
      background: linear-gradient(135deg, #e94560 0%, #d63651 100%);
      padding: 20px;
      border-radius: 12px;
      margin-top: 16px;
      color: white;
    }

    .discount-info,
    .savings-info {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }

    .discount-label,
    .savings-label {
      opacity: 0.9;
    }

    .discount-value {
      font-size: 24px;
      font-weight: 700;
    }

    .savings-value {
      font-size: 18px;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    .btn-cancel-large {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-save {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-save:hover:not(:disabled) {
      background: #d63651;
      transform: translateY(-2px);
    }

    .btn-save:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      margin-top: 20px;
      padding: 14px 18px;
      border-radius: 10px;
      font-size: 14px;
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }

    .message.error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
  `]
})
export class PromotionFormComponent implements OnInit {
  products: Product[] = [];
  selectedProductId = '';
  selectedProduct: Product | null = null;

  promotion = {
    promotionalPrice: 0,
    startDate: '',
    endDate: ''
  };

  today = new Date().toISOString().split('T')[0];
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private promotionService: PromotionService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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

  onProductSelect(): void {
    this.selectedProduct = this.products.find(p => p._id === this.selectedProductId) || null;
    if (this.selectedProduct) {
      // Reset promotion price to something reasonable
      this.promotion.promotionalPrice = Math.round(this.selectedProduct.price * 0.8);
    }
  }

  calculateDiscount(): number {
    if (!this.promotion.promotionalPrice || !this.selectedProduct) return 0;
    const discount = ((this.selectedProduct.price - this.promotion.promotionalPrice) / this.selectedProduct.price) * 100;
    return Math.round(discount);
  }

  isValid(): boolean {
    return !!(
      this.selectedProductId &&
      this.promotion.promotionalPrice > 0 &&
      this.promotion.promotionalPrice < (this.selectedProduct?.price || 0)
    );
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.message = 'Veuillez sélectionner un produit et définir un prix promotionnel valide';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';

    const data = {
      productId: this.selectedProductId,
      promotionalPrice: this.promotion.promotionalPrice,
      startDate: this.promotion.startDate || this.today,
      endDate: this.promotion.endDate || undefined
    };

    this.promotionService.setPromotionalPrice(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.message = '✅ Promotion créée avec succès!';
        setTimeout(() => this.router.navigate(['/seller/promotions']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.error?.error || 'Erreur lors de la création de la promotion';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/seller/promotions']);
  }
}
