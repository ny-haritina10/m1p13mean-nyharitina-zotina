import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdminRentService, RentPayment } from '../../../services/admin-rent.service';
import { AdminContractService, Contract } from '../../../services/admin-contract.service';
import { FinancialReportService, Invoice } from '../../../services/financial-report.service';

@Component({
  selector: 'app-rent-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestion des Loyers</h1>
        <a routerLink="/admin/rents/generate" class="btn-primary">
          <span class="material-icons">add</span>
          Générer un loyer
        </a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalExpected | number }} Ar</span>
            <span class="stat-label">Total attendu</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalCollected | number }} Ar</span>
            <span class="stat-label">Total collecté</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <span class="material-icons">pending</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalUnpaid | number }} Ar</span>
            <span class="stat-label">Non payé</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">
            <span class="material-icons">warning</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.lateCount }}</span>
            <span class="stat-label">Retards</span>
          </div>
        </div>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <label>Statut</label>
          <select [(ngModel)]="filters.status" (change)="loadRents()">
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="paid">Payé</option>
            <option value="late">En retard</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Mois</label>
          <select [(ngModel)]="filters.month" (change)="loadRents()">
            <option value="">Tous</option>
            <option *ngFor="let m of months" [value]="m">{{ getMonthName(m) }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Année</label>
          <select [(ngModel)]="filters.year" (change)="loadRents()">
            <option value="">Toutes</option>
            <option *ngFor="let y of years" [value]="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <div class="table-container" *ngIf="rents.length > 0; else noRents">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vendeur</th>
              <th>Espace</th>
              <th>Mois</th>
              <th>Montant</th>
              <th>Pénalité</th>
              <th>Total</th>
              <th>Échéance</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let rent of rents">
              <td>{{ rent.seller?.boutiqueName || rent.seller?.username }}</td>
              <td>{{ rent.contract?.rentalSpace?.name || '-' }}</td>
              <td>{{ getMonthName(rent.month) }} {{ rent.year }}</td>
              <td>{{ rent.amount | number }} Ar</td>
              <td class="penalty">{{ rent.penaltyAmount | number }} Ar</td>
              <td class="total">{{ rent.totalAmount | number }} Ar</td>
              <td>{{ rent.dueDate | date:'dd/MM/yyyy' }}</td>
              <td>
                <span class="status-badge" [class]="getStatusClass(rent.status)">
                  {{ getStatusLabel(rent.status) }}
                </span>
              </td>
              <td>
                <button *ngIf="rent.status !== 'paid'" 
                        class="btn-pay" 
                        (click)="markAsPaid(rent._id)">
                  <span class="material-icons">payments</span>
                  Marquer payé
                </button>
                <button class="btn-invoice" (click)="generateInvoice(rent._id)">
                  <span class="material-icons">receipt</span>
                  Facture
                </button>
                <button *ngIf="hasInvoice(rent)" class="btn-download" (click)="downloadInvoice(rent)">
                  <span class="material-icons">download</span>
                  PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noRents>
        <div class="empty-state">
          <span class="material-icons">receipt_long</span>
          <p>Aucun loyer trouvé</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
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
      margin: 0;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: var(--transition);
    }
    .btn-primary:hover {
      background: #d63651;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(233, 69, 96, 0.3);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon .material-icons { font-size: 28px; color: white; }
    .stat-icon.blue { background: #4361ee; }
    .stat-icon.green { background: #00b894; }
    .stat-icon.orange { background: #fdcb6e; }
    .stat-icon.red { background: #e74c3c; }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .stat-label { font-size: 13px; color: #636e72; }
    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .filter-group { display: flex; flex-direction: column; gap: 6px; }
    .filter-group label { font-size: 12px; font-weight: 600; color: #636e72; text-transform: uppercase; letter-spacing: 0.5px; }
    .filter-group select {
      padding: 10px 14px;
      border: 2px solid #eee;
      border-radius: 10px;
      font-size: 14px;
      min-width: 140px;
      transition: var(--transition);
    }
    .filter-group select:focus { outline: none; border-color: #e94560; }
    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .data-table th, .data-table td { padding: 16px; text-align: left; }
    .data-table th {
      background: #faf9f6;
      font-weight: 600;
      color: #636e72;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table tr:not(:last-child) td { border-bottom: 1px solid #eee; }
    .data-table tr:hover { background: #faf9f6; }
    .penalty { color: #e74c3c; }
    .total { font-weight: 600; color: #1a1a2e; }
    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-paid { background: #e8f5e9; color: #2e7d32; }
    .status-late { background: #ffebee; color: #c62828; }
    .btn-pay {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: #00b894;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: var(--transition);
    }
    .btn-pay:hover { background: #00a383; }
    .btn-pay .material-icons { font-size: 16px; }
    .btn-invoice {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: #4361ee;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: var(--transition);
    }
    .btn-invoice:hover { background: #3451db; }
    .btn-invoice .material-icons { font-size: 16px; }
    .btn-download {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: #00b894;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: var(--transition);
    }
    .btn-download:hover { background: #00a383; }
    .btn-download .material-icons { font-size: 16px; }
    .empty-state {
      text-align: center;
      padding: 64px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .empty-state .material-icons { font-size: 56px; color: #ddd; margin-bottom: 16px; }
    .empty-state p { color: #636e72; font-size: 15px; }
  `]
})
export class RentListComponent implements OnInit {
  rents: RentPayment[] = [];
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years = [2025, 2026, 2027, 2028];
  
  filters = {
    status: '',
    month: '',
    year: ''
  };

  stats = {
    totalExpected: 0,
    totalCollected: 0,
    totalUnpaid: 0,
    lateCount: 0,
    pendingCount: 0,
    paidCount: 0
  };

  constructor(
    private rentService: AdminRentService,
    private contractService: AdminContractService,
    private reportService: FinancialReportService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/admin/rents' || event.url === '/admin/rents/generate') {
        this.loadRents();
        this.loadStats();
      }
    });
  }

  ngOnInit() {
    this.loadRents();
    this.loadStats();
  }

  loadRents() {
    this.rentService.getRents(
      this.filters.status || undefined,
      this.filters.month ? parseInt(this.filters.month) : undefined,
      this.filters.year ? parseInt(this.filters.year) : undefined
    ).subscribe({
      next: (data) => this.rents = data,
      error: (err) => console.error('Error loading rents', err)
    });
  }

  loadStats() {
    this.rentService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error loading stats', err)
    });
  }

  markAsPaid(id: string) {
    if (confirm('Marquer ce loyer comme payé?')) {
      this.rentService.markAsPaid(id).subscribe({
        next: () => {
          this.loadRents();
          this.loadStats();
        },
        error: (err) => console.error('Error marking as paid', err)
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payé';
      case 'late': return 'En retard';
      default: return status;
    }
  }

  getMonthName(month: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1];
  }

  invoiceMap: { [key: string]: Invoice } = {};

  generateInvoice(rentId: string) {
    this.reportService.generateInvoice(rentId).subscribe({
      next: (data) => {
        this.invoiceMap[rentId] = data.invoice;
        alert('Facture générée avec succès!');
        this.loadRents();
      },
      error: (err) => alert(err.error?.error || 'Erreur lors de la génération de la facture')
    });
  }

  hasInvoice(rent: RentPayment): boolean {
    return !!this.invoiceMap[rent._id];
  }

  downloadInvoice(rent: RentPayment) {
    const invoice = this.invoiceMap[rent._id];
    if (invoice && (invoice._id || invoice.id)) {
      this.reportService.downloadInvoice(invoice._id || invoice.id || '');
    }
  }
}
