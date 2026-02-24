import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PromotionService, PromotionalProduct } from '../../services/promotion.service';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="promo-container">
      <div class="page-header">
        <div>
          <h1>🏷️ Promotions</h1>
          <p>Gérez les produits en promotion</p>
        </div>
        <button routerLink="/seller/promotions/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouvelle promotion
        </button>
      </div>

      <!-- Promotions Table -->
      <div class="table-container" *ngIf="promotions.length > 0; else emptyState">
        <table class="promo-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix Normal</th>
              <th>Prix Promo</th>
              <th>Réduction</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let promo of promotions">
              <td>
                <div class="product-info">
                  <div class="product-image" *ngIf="promo.images?.[0]">
                    <img [src]="promo.images![0]" [alt]="promo.name" />
                  </div>
                  <div class="product-image" *ngIf="!promo.images?.[0]">
                    <span class="material-icons">image</span>
                  </div>
                  <span class="product-name">{{ promo.name }}</span>
                </div>
              </td>
              <td class="old-price">{{ promo.price | number:'1.0-0' }} Ar</td>
              <td class="promo-price">{{ promo.promotionalPrice | number:'1.0-0' }} Ar</td>
              <td>
                <span class="discount-badge">
                  -{{ calculateDiscount(promo) }}%
                </span>
              </td>
              <td>{{ promo.promotionalStartDate | date:'dd/MM/yyyy' }}</td>
              <td>
                <span [class.expired]="isExpired(promo.promotionalEndDate)">
                  {{ promo.promotionalEndDate | date:'dd/MM/yyyy' }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.active]="isActive(promo)" [class.expired]="isExpired(promo.promotionalEndDate)">
                  {{ getStatus(promo) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button (click)="removePromotion(promo._id)" class="btn-icon delete" title="Supprimer">
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
          <span class="material-icons">local_offer</span>
          <h3>Aucune promotion</h3>
          <p>Créez votre première promotion</p>
          <button routerLink="/seller/promotions/create" class="btn-primary">
            <span class="material-icons">add</span>
            Nouvelle promotion
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .promo-container {
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

    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .promo-table {
      width: 100%;
      border-collapse: collapse;
    }

    .promo-table th {
      background: #faf9f6;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .promo-table td {
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

    .old-price {
      text-decoration: line-through;
      color: #636e72;
      font-size: 14px;
    }

    .promo-price {
      font-weight: 700;
      color: #e94560;
      font-size: 15px;
    }

    .discount-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #ffebee;
      color: #e74c3c;
      border-radius: 20px;
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

    .status-badge.expired {
      background: #f5f5f5;
      color: #636e72;
    }

    .expired {
      color: #636e72;
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

    .btn-icon.delete:hover {
      background: #e74c3c;
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
export class PromotionListComponent implements OnInit {
  promotions: PromotionalProduct[] = [];

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.promotionService.getPromotionalProducts().subscribe({
      next: (response) => {
        this.promotions = response.products;
      },
      error: (err) => {
        console.error('Error loading promotions:', err);
      }
    });
  }

  calculateDiscount(product: PromotionalProduct): number {
    if (!product.promotionalPrice || !product.price) return 0;
    const discount = ((product.price - product.promotionalPrice) / product.price) * 100;
    return Math.round(discount);
  }

  isActive(product: PromotionalProduct): boolean {
    if (!product.promotionalEndDate) return true;
    return new Date(product.promotionalEndDate) > new Date();
  }

  isExpired(endDate?: string): boolean {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  }

  getStatus(product: PromotionalProduct): string {
    return this.isActive(product) ? 'Active' : 'Expirée';
  }

  removePromotion(productId: string): void {
    if (confirm('Supprimer cette promotion ?')) {
      this.promotionService.removePromotionalPrice(productId).subscribe({
        next: () => {
          this.loadPromotions();
        },
        error: (err) => {
          console.error('Error removing promotion:', err);
        }
      });
    }
  }
}
