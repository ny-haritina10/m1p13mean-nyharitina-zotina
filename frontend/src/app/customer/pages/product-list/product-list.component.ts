import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductSearchResponse, ProductFilters } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { ProductFiltersComponent, ProductFilters as FilterState } from '../../components/product-filters/product-filters.component';
import { CustomerNavbarComponent } from '../../components/navbar/customer-navbar.component';
import { CustomerFooterComponent } from '../../components/footer/customer-footer.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SearchBarComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ProductFiltersComponent,
    CustomerNavbarComponent,
    CustomerFooterComponent
  ],
  template: `
    <div class="product-list-page">
      <app-customer-navbar></app-customer-navbar>

      <section class="search-section">
        <h1>Nos Produits</h1>
        <p>Découvrez nos produits disponibles dans nos boutiques</p>
        <app-search-bar (search)="onSearch($event)"></app-search-bar>
      </section>

      <main class="products-main">
        <aside class="filters-container">
          <app-product-filters 
            [filters]="currentFilters"
            (filterChange)="onFilterChange($event)">
          </app-product-filters>
        </aside>

        <div class="products-content">
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
        </div>
      </main>

      <app-customer-footer></app-customer-footer>
    </div>
  `,
  styles: [`
    .product-list-page {
      min-height: 100vh;
      background: #faf9f6;
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
      display: flex;
      gap: 32px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 40px;
    }

    .filters-container {
      width: 280px;
      flex-shrink: 0;
    }

    .products-content {
      flex: 1;
      min-width: 0;
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
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    @media (max-width: 1400px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .products-main {
        flex-direction: column;
        padding: 24px 20px;
      }

      .filters-container {
        width: 100%;
      }

      .product-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .search-section {
        padding: 40px 20px 30px;
      }

      .search-section h1 {
        font-size: 32px;
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
  currentFilters: FilterState = {
    category: '',
    boutique: '',
    minPrice: null,
    maxPrice: null,
    promotion: false,
    sort: 'newest'
  };
  loading = true;
  error = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.pagination.page = parseInt(params['page']) || 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    const filters: any = {
      search: this.searchTerm,
      page: this.pagination.page,
      limit: this.pagination.limit,
      category: this.currentFilters.category || undefined,
      boutique: this.currentFilters.boutique || undefined,
      minPrice: this.currentFilters.minPrice || undefined,
      maxPrice: this.currentFilters.maxPrice || undefined,
      promotion: this.currentFilters.promotion || undefined,
      sort: this.currentFilters.sort || undefined
    };

    this.productService.searchProducts(filters)
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

  onFilterChange(filters: FilterState): void {
    this.currentFilters = filters;
    this.pagination.page = 1;
    this.updateQueryParams();
    this.loadProducts();
  }

  updateQueryParams(): void {
    const queryParams: any = { page: this.pagination.page };
    if (this.searchTerm) queryParams.q = this.searchTerm;
    
    this.router.navigate(['/products'], { 
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination.pages) {
      this.pagination.page = page;
      this.updateQueryParams();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getEmptyMessage(): string {
    return this.searchTerm ? 'Essayez avec dautres mots-cles' : 'Aucun produit disponible pour le moment';
  }
}
