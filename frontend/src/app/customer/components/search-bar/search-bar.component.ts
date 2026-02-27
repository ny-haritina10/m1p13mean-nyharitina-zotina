import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="material-icons search-icon">search</span>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (keyup.enter)="onSearch()"
          placeholder="Rechercher un produit..."
          class="search-input"
        />
        <button *ngIf="searchTerm" class="clear-btn" (click)="clearSearch()">
          <span class="material-icons">close</span>
        </button>
      </div>
      <button class="search-btn" (click)="onSearch()">Rechercher</button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 12px;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      color: #9ca3af;
      font-size: 22px;
    }

    .search-input {
      width: 100%;
      padding: 14px 44px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.3s ease;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: #e94560;
      box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.1);
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .clear-btn:hover {
      background: #f3f4f6;
    }

    .clear-btn .material-icons {
      font-size: 20px;
      color: #9ca3af;
    }

    .search-btn {
      padding: 14px 28px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .search-btn:hover {
      background: #d63651;
    }

    @media (max-width: 640px) {
      .search-bar {
        flex-direction: column;
      }

      .search-btn {
        width: 100%;
      }
    }
  `]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';

  constructor(private router: Router) {}

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search.emit('');
  }
}
