import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

export interface ProductFilters {
  category: string;
  boutique: string;
  minPrice: number | null;
  maxPrice: number | null;
  promotion: boolean;
  sort: string;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-sidebar" [class.open]="isMobileOpen">
      <div class="filters-header">
        <h3>Filtres</h3>
        <button class="close-btn" (click)="closeMobile()">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="filter-section">
        <label class="filter-label">Catégorie</label>
        <select [(ngModel)]="filters.category" (change)="onFilterChange()" class="filter-select">
          <option value="">Toutes les catégories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="filter-section">
        <label class="filter-label">Boutique</label>
        <select [(ngModel)]="filters.boutique" (change)="onFilterChange()" class="filter-select">
          <option value="">Toutes les boutiques</option>
          <option *ngFor="let boutique of boutiques" [value]="boutique">{{ boutique }}</option>
        </select>
      </div>

      <div class="filter-section">
        <label class="filter-label">Prix (MGA)</label>
        <div class="price-inputs">
          <input 
            type="number" 
            [(ngModel)]="filters.minPrice" 
            (change)="onFilterChange()"
            placeholder="Min"
            class="price-input"
          />
          <span class="price-separator">-</span>
          <input 
            type="number" 
            [(ngModel)]="filters.maxPrice" 
            (change)="onFilterChange()"
            placeholder="Max"
            class="price-input"
          />
        </div>
      </div>

      <div class="filter-section">
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            [(ngModel)]="filters.promotion" 
            (change)="onFilterChange()"
          />
          <span class="checkbox-custom"></span>
          <span class="checkbox-label">
            <span class="material-icons">local_offer</span>
            Promotions uniquement
          </span>
        </label>
      </div>

      <div class="filter-section">
        <label class="filter-label">Trier par</label>
        <select [(ngModel)]="filters.sort" (change)="onFilterChange()" class="filter-select">
          <option value="newest">Plus récents</option>
          <option value="price_asc">Prix: croissant</option>
          <option value="price_desc">Prix: décroissant</option>
          <option value="name_asc">Nom: A-Z</option>
          <option value="name_desc">Nom: Z-A</option>
        </select>
      </div>

      <button class="clear-filters-btn" (click)="clearFilters()">
        <span class="material-icons">clear</span>
        Effacer les filtres
      </button>
    </div>

    <button class="mobile-filter-btn" (click)="openMobile()">
      <span class="material-icons">filter_list</span>
      Filtres
      <span *ngIf="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
    </button>

    <div class="mobile-overlay" *ngIf="isMobileOpen" (click)="closeMobile()"></div>
  `,
  styles: [`
    .filters-sidebar {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .filters-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .filter-section {
      margin-bottom: 20px;
      width: 100%;
      box-sizing: border-box;
    }

    .filter-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .filter-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      background: #f9fafb;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: #e94560;
      background: white;
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .price-input {
      flex: 1;
      min-width: 0;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      background: #f9fafb;
      box-sizing: border-box;
    }

    .price-input:focus {
      outline: none;
      border-color: #e94560;
      background: white;
    }

    .price-input::placeholder {
      font-size: 13px;
    }

    .price-separator {
      color: #9ca3af;
    }

    .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      transition: all 0.2s;
    }

    .filter-checkbox:hover {
      border-color: #e94560;
    }

    .filter-checkbox input {
      display: none;
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .filter-checkbox input:checked + .checkbox-custom {
      background: #e94560;
      border-color: #e94560;
    }

    .filter-checkbox input:checked + .checkbox-custom::after {
      content: '✓';
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #374151;
    }

    .checkbox-label .material-icons {
      font-size: 18px;
      color: #ef4444;
    }

    .clear-filters-btn {
      width: 100%;
      padding: 12px;
      background: #f3f4f6;
      border: none;
      border-radius: 10px;
      color: #6b7280;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      margin-top: 20px;
    }

    .clear-filters-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .mobile-filter-btn {
      display: none;
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 14px 28px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
      z-index: 100;
      gap: 8px;
      align-items: center;
    }

    .filter-badge {
      background: white;
      color: #e94560;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }

    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 199;
    }

    @media (max-width: 1024px) {
      .filters-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 100vh;
        border-radius: 0;
        z-index: 200;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        overflow-y: auto;
        padding-top: 20px;
      }

      .filters-sidebar.open {
        transform: translateX(0);
      }

      .close-btn {
        display: block;
      }

      .mobile-filter-btn {
        display: flex;
      }

      .mobile-overlay {
        display: block;
      }
    }
  `]
})
export class ProductFiltersComponent implements OnInit {
  @Input() filters: ProductFilters = {
    category: '',
    boutique: '',
    minPrice: null,
    maxPrice: null,
    promotion: false,
    sort: 'newest'
  };
  @Output() filterChange = new EventEmitter<ProductFilters>();

  categories: string[] = [];
  boutiques: string[] = [];
  isMobileOpen = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  loadFilterOptions(): void {
    this.productService.getFilterOptions().subscribe({
      next: (res) => {
        this.categories = res.categories || [];
        this.boutiques = res.boutiques || [];
      }
    });
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.category) count++;
    if (this.filters.boutique) count++;
    if (this.filters.minPrice !== null) count++;
    if (this.filters.maxPrice !== null) count++;
    if (this.filters.promotion) count++;
    return count;
  }

  onFilterChange(): void {
    this.filterChange.emit(this.filters);
    this.closeMobile();
  }

  clearFilters(): void {
    this.filters = {
      category: '',
      boutique: '',
      minPrice: null,
      maxPrice: null,
      promotion: false,
      sort: 'newest'
    };
    this.filterChange.emit(this.filters);
    this.closeMobile();
  }

  openMobile(): void {
    this.isMobileOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMobile(): void {
    this.isMobileOpen = false;
    document.body.style.overflow = '';
  }
}
