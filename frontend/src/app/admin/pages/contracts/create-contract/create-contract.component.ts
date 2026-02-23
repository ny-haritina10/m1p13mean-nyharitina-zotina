import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminContractService, CreateContractDto } from '../../../services/admin-contract.service';
import { AdminSellerService, Seller } from '../../../services/admin-seller.service';
import { AdminSpaceService, RentalSpace } from '../../../services/admin-space.service';

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/admin/contracts" class="back-link">
          <span class="material-icons">arrow_back</span>
          Retour
        </a>
        <h1>Nouveau Contrat</h1>
      </div>

      <form (ngSubmit)="createContract()" class="form-container">
        <div class="form-group">
          <label for="sellerId">Vendeur *</label>
          <select id="sellerId" [(ngModel)]="contract.sellerId" name="sellerId" required>
            <option value="">Sélectionner un vendeur</option>
            <option *ngFor="let seller of approvedSellers" [value]="seller._id">
              {{ seller.boutiqueName || seller.username }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="rentalSpaceId">Espace Commercial *</label>
          <select id="rentalSpaceId" [(ngModel)]="contract.rentalSpaceId" name="rentalSpaceId" required>
            <option value="">Sélectionner un espace</option>
            <option *ngFor="let space of availableSpaces" [value]="space._id">
              {{ space.name }} ({{ space.type }}) - {{ space.monthlyPrice | number }} Ar
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Date de début *</label>
            <input type="date" id="startDate" [(ngModel)]="contract.startDate" name="startDate" required>
          </div>

          <div class="form-group">
            <label for="endDate">Date de fin *</label>
            <input type="date" id="endDate" [(ngModel)]="contract.endDate" name="endDate" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="monthlyRent">Loyer Mensuel (Ar) *</label>
            <input type="number" id="monthlyRent" [(ngModel)]="contract.monthlyRent" name="monthlyRent" required min="0">
          </div>

          <div class="form-group">
            <label for="depositAmount">Montant de la caution (Ar)</label>
            <input type="number" id="depositAmount" [(ngModel)]="contract.depositAmount" name="depositAmount" min="0">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" routerLink="/admin/contracts">Annuler</button>
          <button type="submit" class="btn-primary" [disabled]="!isFormValid()">Créer le Contrat</button>
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
export class CreateContractComponent implements OnInit {
  contract: CreateContractDto = {
    sellerId: '',
    rentalSpaceId: '',
    startDate: '',
    endDate: '',
    monthlyRent: 0,
    depositAmount: 0
  };

  approvedSellers: Seller[] = [];
  availableSpaces: RentalSpace[] = [];
  errorMessage = '';

  constructor(
    private contractService: AdminContractService,
    private sellerService: AdminSellerService,
    private spaceService: AdminSpaceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadApprovedSellers();
    this.loadAvailableSpaces();
  }

  loadApprovedSellers() {
    this.sellerService.getSellers('approved').subscribe({
      next: (data) => this.approvedSellers = data,
      error: (err) => console.error('Error loading sellers', err)
    });
  }

  loadAvailableSpaces() {
    this.spaceService.getAvailableSpaces().subscribe({
      next: (data) => this.availableSpaces = data,
      error: (err) => console.error('Error loading spaces', err)
    });
  }

  isFormValid(): boolean {
    return !!(this.contract.sellerId && 
              this.contract.rentalSpaceId && 
              this.contract.startDate && 
              this.contract.endDate && 
              this.contract.monthlyRent > 0);
  }

  createContract() {
    if (!this.isFormValid()) return;

    this.contractService.createContract(this.contract).subscribe({
      next: () => {
        this.router.navigate(['/admin/contracts']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de la création du contrat';
      }
    });
  }
}
