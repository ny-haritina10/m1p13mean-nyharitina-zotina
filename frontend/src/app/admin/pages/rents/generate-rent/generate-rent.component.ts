import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminRentService, CreateRentDto } from '../../../services/admin-rent.service';
import { AdminContractService, Contract } from '../../../services/admin-contract.service';

@Component({
  selector: 'app-generate-rent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/admin/rents" class="back-link">
          <span class="material-icons">arrow_back</span>
          Retour
        </a>
        <h1>Générer un loyer</h1>
      </div>

      <form (ngSubmit)="generateRent()" class="form-container">
        <div class="form-group">
          <label for="contractId">Contrat *</label>
          <select id="contractId" [(ngModel)]="rent.contractId" name="contractId" required>
            <option value="">Sélectionner un contrat</option>
            <option *ngFor="let contract of contracts" [value]="contract._id">
              {{ contract.seller?.boutiqueName || contract.seller?.username }} - {{ contract.rentalSpace?.name }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="month">Mois *</label>
            <select id="month" [(ngModel)]="rent.month" name="month" required>
              <option value="">Sélectionner</option>
              <option *ngFor="let m of months" [value]="m">{{ getMonthName(m) }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="year">Année *</label>
            <select id="year" [(ngModel)]="rent.year" name="year" required>
              <option value="">Sélectionner</option>
              <option *ngFor="let y of years" [value]="y">{{ y }}</option>
            </select>
          </div>
        </div>

        <div *ngIf="selectedContract" class="preview-card">
          <h3>Aperçu</h3>
          <div class="preview-row">
            <span>Montant mensuel:</span>
            <span class="amount">{{ selectedContract.monthlyRent | number }} Ar</span>
          </div>
          <div class="preview-row">
            <span>Échéance:</span>
            <span>5 du mois</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" routerLink="/admin/rents">Annuler</button>
          <button type="submit" class="btn-primary" [disabled]="!isFormValid()">
            <span class="material-icons">add</span>
            Générer le loyer
          </button>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          <span class="material-icons">error</span>
          {{ errorMessage }}
        </div>
        
        <div *ngIf="successMessage" class="success-message">
          <span class="material-icons">check_circle</span>
          {{ successMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 600px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #636e72;
      text-decoration: none;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .back-link:hover { color: #e94560; }
    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }
    .form-container {
      background: white;
      padding: 32px;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(26, 26, 46, 0.08);
    }
    .form-group { margin-bottom: 24px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #1a1a2e; font-size: 14px; }
    input, select {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #eee;
      border-radius: 12px;
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      transition: var(--transition);
    }
    input:focus, select:focus { outline: none; border-color: #e94560; }
    .preview-card {
      background: #faf9f6;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .preview-card h3 {
      font-size: 14px;
      color: #636e72;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .preview-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }
    .preview-row .amount {
      font-weight: 700;
      color: #1a1a2e;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .btn-primary, .btn-secondary {
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }
    .btn-primary { background: #e94560; color: white; }
    .btn-primary:hover:not(:disabled) { background: #d63651; }
    .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
    .btn-secondary { background: #eee; color: #636e72; }
    .btn-secondary:hover { background: #ddd; }
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 14px;
      background: #fff5f5;
      border: 1px solid #ffcaca;
      border-radius: 12px;
      color: #e74c3c;
      font-size: 14px;
    }
    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 14px;
      background: #f0fff4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      color: #00b894;
      font-size: 14px;
    }
  `]
})
export class GenerateRentComponent implements OnInit {
  rent: CreateRentDto = {
    contractId: '',
    month: 0,
    year: new Date().getFullYear()
  };

  contracts: Contract[] = [];
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years = [2025, 2026, 2027, 2028];
  
  errorMessage = '';
  successMessage = '';

  constructor(
    private rentService: AdminRentService,
    private contractService: AdminContractService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getContracts('active').subscribe({
      next: (data) => this.contracts = data,
      error: (err) => console.error('Error loading contracts', err)
    });
  }

  get selectedContract(): Contract | undefined {
    return this.contracts.find(c => c._id === this.rent.contractId);
  }

  isFormValid(): boolean {
    return !!(this.rent.contractId && this.rent.month && this.rent.year);
  }

  generateRent() {
    if (!this.isFormValid()) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.rentService.generateRent(this.rent).subscribe({
      next: () => {
        this.successMessage = 'Loyer généré avec succès!';
        setTimeout(() => this.router.navigate(['/admin/rents']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de la génération du loyer';
      }
    });
  }

  getMonthName(month: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1];
  }
}
