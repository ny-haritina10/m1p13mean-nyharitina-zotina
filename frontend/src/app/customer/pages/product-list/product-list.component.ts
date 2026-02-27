import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductSearchResponse } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    ProductCardComponent, 
    SearchBarComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="product-list-page">
      <header class="header">
        <div class="logo" routerLink="/">
          <span class="material-icons">storefront</span>
          <span>Centre Commercial</span>
        </div>
        <nav class="nav">
          <a routerLink="/" class="nav-link">Accueil</a>
          <a routerLink="/products" class="nav-link active">Produits</a>
          <ng-container *ngIf="!isLoggedIn">
            <a routerLink="/customer-login" class="nav-link">Connexion</a>
            <a routerLink="/register" class="nav-link btn-register">Créer un compte</a>
          </ng-container>
          <ng-container *ngIf="isLoggedIn">
            <a (click)="logout()" class="nav-link btn-logout">Se déconnecter</a>
          </ng-container>
        </nav>
      </header>

      <section class="search-section">
        <h1>Nos Produits</h1>
        <p>Découvrez nos produits disponibles dans nos boutiques</p>
        <app-search-bar (search)="onSearch($event)"></app-search-bar>
      </section>

      <main class="products-main">
        <div class="results-info" *ngIf="!loading && !error">
          <span *ngIf="searchTerm">Résultats pour "{{ searchTerm }}"</span>
          <span *ngIf="!searchTerm">Tous les produits</span>
          <span class="count">({{ pagination.total }} produits)</span>
        </div>

        <ng-container *ngIf="loading">
          <app-loading-skeleton [count]="12"></app-loading-skeleton>
        </ng-container>

        <ng-container *ngIf="!loading && error">
          <app-empty-state 
            icon="error_outline" 
            title="Erreur" 
            [message]="error">
          </app-empty-state>
        </ng-container>

        <ng-container *ngIf="!loading && !error && products.length === 0">
          <app-empty-state 
            icon="inventory_2" 
            title="Aucun produit trouvé" 
            [message]="getEmptyMessage()">
          </app-empty-state>
        </ng-container>

        <div class="product-grid" *ngIf="!loading && !error && products.length > 0">
          <app-product-card 
            *ngFor="let product of products" 
            [product]="product">
          </app-product-card>
        </div>

        <div class="pagination" *ngIf="!loading && !error && pagination.pages > 1">
          <button 
            class="page-btn" 
            [disabled]="pagination.page <= 1"
            (click)="goToPage(pagination.page - 1)">
            <span class="material-icons">chevron_left</span>
          </button>
          
          <span class="page-info">
            Page {{ pagination.page }} sur {{ pagination.pages }}
          </span>
          
          <button 
            class="page-btn" 
            [disabled]="pagination.page >= pagination.pages"
            (click)="goToPage(pagination.page + 1)">
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </main>

      <footer class="footer">
        <p>&copy; 2026 Centre Commercial. Tous droits réservés.</p>
      </footer>
    </div>
  `,
  styles: [`
    .product-list-page {
      min-height: 100vh;
      background: #faf9f6;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      cursor: pointer;
      text-decoration: none;
    }

    .logo .material-icons {
      color: #e94560;
      font-size: 28px;
    }

    .nav {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: #636e72;
      font-weight: 500;
      transition: color 0.3s;
      cursor: pointer;
    }

    .nav-link:hover, .nav-link.active {
      color: #e94560;
    }

    .btn-register {
      background: #e94560;
      color: white !important;
      padding: 10px 20px;
      border-radius: 8px;
    }

    .btn-register:hover {
      background: #d63651;
    }

    .btn-logout {
      background: #ef4444;
      color: white !important;
      padding: 10px 20px;
      border-radius: 8px;
    }

    .search-section {
      text-align: center;
      padding: 60px 40px 40px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }

    .search-section h1 {
      font-size: 42px;
      margin: 0 0 12px 0;
    }

    .search-section p {
      font-size: 18px;
      opacity: 0.8;
      margin: 0 0 32px 0;
    }

    .products-main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 40px;
    }

    .results-info {
      margin-bottom: 24px;
      color: #6b7280;
      font-size: 15px;
    }

    .results-info .count {
      color: #9ca3af;
      margin-left: 4px;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    @media (max-width: 1400px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .header {
        padding: 16px 20px;
        flex-direction: column;
        gap: 16px;
      }

      .search-section {
        padding: 40px 20px 30px;
      }

      .search-section h1 {
        font-size: 32px;
      }

      .products-main {
        padding: 24px 20px;
      }

      .product-grid {
        grid-template-columns: 1fr;
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid #e5e7eb;
    }

    .page-btn {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn:hover:not(:disabled) {
      border-color: #e94560;
      color: #e94560;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #6b7280;
      font-size: 14px;
    }

    .footer {
      text-align: center;
      padding: 20px;
      color: #636e72;
      background: white;
      margin-top: 40px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pagination = {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  };
  searchTerm = '';
  loading = true;
  error = '';
  isLoggedIn = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.checkAuth();
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.pagination.page = parseInt(params['page']) || 1;
      this.loadProducts();
    });
  }

  checkAuth(): boolean {
    return !!localStorage.getItem('token');
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.searchProducts(this.searchTerm, this.pagination.page, this.pagination.limit)
      .subscribe({
        next: (response: ProductSearchResponse) => {
          this.products = response.data;
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.error || 'Erreur lors du chargement des produits';
          this.loading = false;
        }
      });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.pagination.page = 1;
    this.router.navigate(['/products'], { 
      queryParams: { q: term || null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination.pages) {
      this.pagination.page = page;
      this.router.navigate(['/products'], { 
        queryParams: { q: this.searchTerm || null, page }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getEmptyMessage(): string {
    return this.searchTerm ? 'Essayez avec dautres mots-cles' : 'Aucun produit disponible pour le moment';
  }
}
