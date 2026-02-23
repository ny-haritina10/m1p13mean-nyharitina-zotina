import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SpaceAssignmentService, Seller, Space, AssignSpaceDto } from '../../services/space-assignment.service';

@Component({
  selector: 'app-assign-space',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/admin/contracts" class="back-link">
          <span class="material-icons">arrow_back</span>
          Retour aux contrats
        </a>
        <h1>Nouveau Contrat</h1>
      </div>

      <div class="form-card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Vendeur</label>
            <select [(ngModel)]="form.sellerId" name="sellerId" required (change)="onSellerChange()">
              <option value="">Sélectionner un vendeur</option>
              <option *ngFor="let seller of sellers" [value]="seller._id">
                {{ seller.boutiqueName || seller.username }}
              </option>
            </select>
            <small *ngIf="sellers.length === 0" class="error-text">Aucun vendeur approuvé disponible</small>
          </div>

          <div class="form-group">
            <label>Espace disponible</label>
            <select [(ngModel)]="form.spaceId" name="spaceId" required (change)="onSpaceChange()">
              <option value="">Sélectionner un espace</option>
              <option *ngFor="let space of availableSpaces" [value]="space._id">
                {{ space.name }} - {{ getTypeLabel(space.type) }} - {{ space.floor === 0 ? 'RDC' : 'Étage ' + space.floor }} - {{ space.monthlyPrice | number }} Ar
              </option>
            </select>
            <small *ngIf="availableSpaces.length === 0" class="error-text">Aucun espace disponible</small>
          </div>

          <div class="selected-space-info" *ngIf="selectedSpace">
            <h3>Détails de l'espace</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Nom</span>
                <span class="value">{{ selectedSpace.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">Type</span>
                <span class="value">{{ getTypeLabel(selectedSpace.type) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Étage</span>
                <span class="value">{{ selectedSpace.floor === 0 ? 'Rez-de-chaussée' : 'Étage ' + selectedSpace.floor }}</span>
              </div>
              <div class="info-item">
                <span class="label">Surface</span>
                <span class="value">{{ selectedSpace.surface || '-' }} m²</span>
              </div>
              <div class="info-item">
                <span class="label">Prix mensuel</span>
                <span class="value highlight">{{ selectedSpace.monthlyPrice | number }} Ar</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date de début</label>
              <input type="date" [(ngModel)]="form.startDate" name="startDate" required>
            </div>
            <div class="form-group">
              <label>Date de fin</label>
              <input type="date" [(ngModel)]="form.endDate" name="endDate" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Loyer mensuel (Ar)</label>
              <input type="number" [(ngModel)]="form.monthlyRent" name="monthlyRent" [placeholder]="selectedSpace ? selectedSpace.monthlyPrice.toString() : ''">
              <small>Laisser vide pour utiliser le prix par défaut</small>
            </div>
            <div class="form-group">
              <label>Dépôt (Ar)</label>
              <input type="number" [(ngModel)]="form.depositAmount" name="depositAmount" placeholder="0">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" routerLink="/admin/contracts">Annuler</button>
            <button type="submit" class="btn-primary" [disabled]="!isFormValid() || submitting">
              {{ submitting ? 'Création...' : 'Créer le contrat' }}
            </button>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <span class="material-icons">error</span>
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            <span class="material-icons">check_circle</span>
            {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .back-link { display: flex; align-items: center; gap: 8px; color: #636e72; text-decoration: none; margin-bottom: 16px; }
    .back-link:hover { color: #1a1a2e; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: #1a1a2e; margin: 0; }
    .form-card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06); }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-weight: 600; color: #1a1a2e; margin-bottom: 8px; }
    .form-group input, .form-group select { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #3b82f6; }
    .form-group small { color: #636e72; font-size: 12px; }
    .error-text { color: #e74c3c; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .selected-space-info { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .selected-space-info h3 { margin: 0 0 16px; font-size: 16px; color: #1a1a2e; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .info-item { display: flex; flex-direction: column; }
    .info-item .label { font-size: 12px; color: #636e72; }
    .info-item .value { font-weight: 600; color: #1a1a2e; }
    .info-item .value.highlight { color: #3b82f6; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .btn-primary, .btn-secondary { padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn-primary { background: #3b82f6; color: white; border: none; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: #f1f5f9; color: #1a1a2e; border: none; }
    .btn-secondary:hover { background: #e2e8f0; }
    .error-message { display: flex; align-items: center; gap: 8px; padding: 16px; background: #fef2f2; color: #dc2626; border-radius: 10px; margin-top: 16px; }
    .success-message { display: flex; align-items: center; gap: 8px; padding: 16px; background: #f0fdf4; color: #16a34a; border-radius: 10px; margin-top: 16px; }
    @media (max-width: 640px) { .form-row, .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class AssignSpaceComponent implements OnInit {
  sellers: Seller[] = [];
  availableSpaces: Space[] = [];
  selectedSpace: Space | null = null;
  
  form: AssignSpaceDto = {
    sellerId: '',
    spaceId: '',
    startDate: '',
    endDate: '',
    monthlyRent: 0,
    depositAmount: 0
  };

  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private assignmentService: SpaceAssignmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.assignmentService.getApprovedSellers().subscribe({
      next: (data) => this.sellers = data,
      error: () => {}
    });
    this.assignmentService.getAvailableSpaces().subscribe({
      next: (data) => this.availableSpaces = data,
      error: () => {}
    });
  }

  onSellerChange() {
    // Future: check if seller already has a contract
  }

  onSpaceChange() {
    this.selectedSpace = this.availableSpaces.find(s => s._id === this.form.spaceId) || null;
    if (this.selectedSpace && !this.form.monthlyRent) {
      this.form.monthlyRent = this.selectedSpace.monthlyPrice;
    }
  }

  isFormValid(): boolean {
    return !!(this.form.sellerId && this.form.spaceId && this.form.startDate && this.form.endDate);
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    
    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.assignmentService.assignSpace(this.form).subscribe({
      next: (res) => {
        this.submitting = false;
        this.successMessage = 'Contrat créé avec succès!';
        setTimeout(() => this.router.navigate(['/admin/contracts']), 1500);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.error || 'Erreur lors de la création du contrat';
      }
    });
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'box': return 'Box';
      case 'kiosque': return 'Kiosque';
      case 'stand': return 'Stand';
      default: return type;
    }
  }
}
