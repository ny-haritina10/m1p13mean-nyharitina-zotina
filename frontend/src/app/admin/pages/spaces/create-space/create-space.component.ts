import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminSpaceService, CreateSpaceDto } from '../../../services/admin-space.service';

@Component({
  selector: 'app-create-space',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/admin/spaces" class="back-link">
          <span class="material-icons">arrow_back</span>
          Retour
        </a>
        <h1>Nouvel Espace Commercial</h1>
      </div>

      <form (ngSubmit)="createSpace()" class="form-container">
        <div class="form-group">
          <label for="name">Nom *</label>
          <input type="text" id="name" [(ngModel)]="space.name" name="name" required placeholder="Ex: Box A12">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="type">Type *</label>
            <select id="type" [(ngModel)]="space.type" name="type" required>
              <option value="">Sélectionner un type</option>
              <option value="box">Box</option>
              <option value="kiosque">Kiosque</option>
              <option value="stand">Stand</option>
            </select>
          </div>

          <div class="form-group">
            <label for="location">Emplacement</label>
            <input type="text" id="location" [(ngModel)]="space.location" name="location" placeholder="Ex: Étage 1, Zone A">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="surface">Surface (m²)</label>
            <input type="number" id="surface" [(ngModel)]="space.surface" name="surface" min="0" placeholder="Ex: 25">
          </div>

          <div class="form-group">
            <label for="monthlyPrice">Prix Mensuel (Ar) *</label>
            <input type="number" id="monthlyPrice" [(ngModel)]="space.monthlyPrice" name="monthlyPrice" required min="0">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" routerLink="/admin/spaces">Annuler</button>
          <button type="submit" class="btn-primary" [disabled]="!isFormValid()">Créer l'Espace</button>
        </div>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      text-decoration: none;
      margin-bottom: 16px;
    }
    .back-link:hover { color: #3b82f6; }
    .page-header h1 { margin: 0; font-size: 24px; color: #1e293b; }
    .form-container {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .form-group { margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    label { display: block; margin-bottom: 6px; font-weight: 500; color: #374151; }
    input, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
    }
    input:focus, select:focus { outline: none; border-color: #3b82f6; }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .btn-primary, .btn-secondary {
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover:not(:disabled) { background: #2563eb; }
    .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
    .btn-secondary:hover { background: #cbd5e1; }
    .error-message { color: #ef4444; margin-top: 16px; padding: 12px; background: #fee2e2; border-radius: 8px; }
  `]
})
export class CreateSpaceComponent implements OnInit {
  space: CreateSpaceDto = {
    name: '',
    type: 'box',
    location: '',
    surface: 0,
    monthlyPrice: 0
  };

  errorMessage = '';

  constructor(
    private spaceService: AdminSpaceService,
    private router: Router
  ) {}

  ngOnInit() {}

  isFormValid(): boolean {
    return !!(this.space.name && this.space.type && this.space.monthlyPrice > 0);
  }

  createSpace() {
    if (!this.isFormValid()) return;

    this.spaceService.createSpace(this.space).subscribe({
      next: () => {
        this.router.navigate(['/admin/spaces']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de la création de l\'espace';
      }
    });
  }
}
