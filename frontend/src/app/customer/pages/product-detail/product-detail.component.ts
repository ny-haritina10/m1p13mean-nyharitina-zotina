import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, ProductDetailResponse } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { ImageGalleryComponent } from '../../components/image-gallery/image-gallery.component';
import { PriceDisplayComponent } from '../../components/price-display/price-display.component';
import { StockBadgeComponent } from '../../components/stock-badge/stock-badge.component';
import { BoutiqueLocationComponent } from '../../components/boutique-location/boutique-location.component';
import { CustomerNavbarComponent } from '../../components/navbar/customer-navbar.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ImageGalleryComponent, 
    PriceDisplayComponent, 
    StockBadgeComponent,
    BoutiqueLocationComponent,
    CustomerNavbarComponent
  ],
  template: `
    <div class="product-detail-page">
      <app-customer-navbar></app-customer-navbar>

      <div class="breadcrumb">
        <a routerLink="/">Accueil</a>
        <span class="separator">/</span>
        <a routerLink="/products">Produits</a>
        <span class="separator">/</span>
        <span class="current">{{ productName }}</span>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="loading-skeleton">
          <div class="skeleton-image"></div>
          <div class="skeleton-info">
            <div class="skeleton-title"></div>
            <div class="skeleton-price"></div>
            <div class="skeleton-badge"></div>
            <div class="skeleton-desc"></div>
            <div class="skeleton-desc short"></div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error-container">
        <div class="error-icon">
          <span class="material-icons">error_outline</span>
        </div>
        <h2>Produit non trouvé</h2>
        <p>{{ error }}</p>
        <a routerLink="/products" class="btn-back">Retour aux produits</a>
      </div>

      <div *ngIf="!loading && !error && product" class="product-content">
        <div class="product-gallery">
          <app-image-gallery 
            [images]="product.images" 
            [imageAlt]="product.name"
          ></app-image-gallery>
        </div>

        <div class="product-info">
          <div class="category-badge">{{ product.category }}</div>
          
          <h1 class="product-title">{{ product.name }}</h1>
          
          <app-price-display
            [price]="product.price"
            [promotionalPrice]="product.promotionalPrice"
            [promotionActive]="product.promotionActive"
          ></app-price-display>

          <div class="stock-section">
            <app-stock-badge 
              [stock]="product.stock"
            ></app-stock-badge>
          </div>

          <div class="description-section">
            <h3>Description</h3>
            <p>{{ product.description || 'Aucune description disponible.' }}</p>
          </div>

          <app-boutique-location
            [boutiqueName]="product.boutique.name"
            [zone]="product.boutique.location.zone"
            [floor]="product.boutique.location.floor"
            [unitNumber]="product.boutique.location.unitNumber"
          ></app-boutique-location>

          <div class="action-buttons">
            <button 
              class="btn-primary" 
              [disabled]="product.stock === 0"
              (click)="addToCart()"
            >
              <span class="material-icons">shopping_cart</span>
              {{ product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
            </button>
            <button class="btn-secondary">
              <span class="material-icons">favorite_border</span>
              Favoris
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      min-height: 100vh;
      background: #faf9f6;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 14px;
    }

    .breadcrumb a {
      color: #6b7280;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      color: #2563eb;
    }

    .breadcrumb .separator {
      color: #d1d5db;
    }

    .breadcrumb .current {
      color: #1f2937;
      font-weight: 500;
    }

    .loading-container {
      animation: pulse 1.5s infinite;
    }

    .loading-skeleton {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }

    .skeleton-image {
      aspect-ratio: 1;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 16px;
    }

    .skeleton-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .skeleton-title {
      height: 32px;
      background: #f3f4f6;
      border-radius: 8px;
      width: 70%;
    }

    .skeleton-price {
      height: 48px;
      background: #f3f4f6;
      border-radius: 8px;
      width: 40%;
    }

    .skeleton-badge {
      height: 32px;
      background: #f3f4f6;
      border-radius: 8px;
      width: 30%;
    }

    .skeleton-desc {
      height: 20px;
      background: #f3f4f6;
      border-radius: 4px;
      width: 100%;
    }

    .skeleton-desc.short {
      width: 60%;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .error-container {
      text-align: center;
      padding: 80px 24px;
    }

    .error-icon {
      margin-bottom: 16px;
    }

    .error-icon .material-icons {
      font-size: 64px;
      color: #d1d5db;
    }

    .error-container h2 {
      color: #1f2937;
      margin-bottom: 8px;
    }

    .error-container p {
      color: #6b7280;
      margin-bottom: 24px;
    }

    .btn-back {
      display: inline-block;
      padding: 12px 24px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 500;
    }

    .product-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .product-gallery {
      position: sticky;
      top: 24px;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .category-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #e0e7ff;
      color: #4f46e5;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: fit-content;
    }

    .product-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      line-height: 1.2;
    }

    .stock-section {
      padding-top: 8px;
    }

    .description-section {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .description-section h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .description-section p {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.6;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .btn-primary {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 24px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .btn-primary .material-icons {
      font-size: 20px;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      border-color: #2563eb;
      color: #2563eb;
    }

    .btn-secondary .material-icons {
      font-size: 20px;
    }

    @media (max-width: 1024px) {
      .product-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .product-gallery {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .header {
        padding: 16px 20px;
        flex-direction: column;
        gap: 16px;
      }

      .product-detail-page {
        padding: 16px;
      }

      .product-content {
        padding: 16px;
      }

      .product-title {
        font-size: 24px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        padding: 14px 20px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: ProductDetailResponse['data'] | null = null;
  loading = true;
  error: string | null = null;
  productName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.error = null;
    this.product = null;

    this.productService.getProductDetail(id).subscribe({
      next: (response) => {
        this.product = response.data;
        this.productName = response.data.name;
        this.loading = false;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.error = 'Ce produit n\'existe pas ou a été supprimé.';
        } else if (err.status === 403) {
          this.error = 'Ce produit n\'est pas disponible actuellement.';
        } else if (err.status === 400) {
          this.error = 'Identifiant de produit invalide.';
        } else {
          this.error = 'Une erreur est survenue lors du chargement du produit.';
        }
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: (response) => {
        this.cartService.updateCartSubject(response.data);
        alert('Produit ajouté au panier!');
      },
      error: (err) => {
        alert(err.error?.error || 'Erreur lors de l\'ajout au panier');
      }
    });
  }
}
