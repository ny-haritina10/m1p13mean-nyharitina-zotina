import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FinancialReportService, MonthlyReport } from '../../../services/financial-report.service';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/admin/reports/dashboard" class="back-link">
          <span class="material-icons">arrow_back</span>
          Retour
        </a>
        <h1>Rapport Mensuel</h1>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <label>Mois</label>
          <select [(ngModel)]="month" (change)="loadReport()">
            <option *ngFor="let m of months" [value]="m">{{ getMonthName(m) }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Année</label>
          <select [(ngModel)]="year" (change)="loadReport()">
            <option *ngFor="let y of years" [value]="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <div class="stats-grid" *ngIf="report">
        <div class="stat-card">
          <div class="stat-icon blue">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ report.totalExpectedRevenue | number }} Ar</span>
            <span class="stat-label">Revenu attendu</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon green">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ report.totalCollected | number }} Ar</span>
            <span class="stat-label">Revenu collecté</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orange">
            <span class="material-icons">pending</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ report.totalUnpaid | number }} Ar</span>
            <span class="stat-label">Non payé</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon red">
            <span class="material-icons">warning</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ report.latePayments }}</span>
            <span class="stat-label">Retards</span>
          </div>
        </div>
      </div>

      <div class="counts-row" *ngIf="report">
        <div class="count-badge paid">
          <span class="material-icons">check_circle</span>
          <span>{{ report.paidCount }} paiements effectués</span>
        </div>
        <div class="count-badge unpaid">
          <span class="material-icons">cancel</span>
          <span>{{ report.unpaidCount }} paiements en attente</span>
        </div>
      </div>

      <div class="table-container" *ngIf="report && report.payments.length > 0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Vendeur</th>
              <th>Espace</th>
              <th>Montant</th>
              <th>Pénalité</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of report.payments">
              <td>{{ payment.seller?.boutiqueName || payment.seller?.username }}</td>
              <td>{{ payment.contract?.rentalSpace?.name || '-' }}</td>
              <td>{{ payment.amount | number }} Ar</td>
              <td class="penalty">{{ payment.penaltyAmount | number }} Ar</td>
              <td class="total">{{ payment.totalAmount | number }} Ar</td>
              <td>
                <span class="status-badge" [class]="'status-' + payment.status">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="report && report.payments.length === 0">
        <span class="material-icons">receipt_long</span>
        <p>Aucun paiement pour cette période</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header { margin-bottom: 24px; }
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
    .filter-group label { font-size: 12px; font-weight: 600; color: #636e72; text-transform: uppercase; }
    .filter-group select {
      padding: 10px 14px;
      border: 2px solid #eee;
      border-radius: 10px;
      font-size: 14px;
      min-width: 160px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
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
    .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: #1a1a2e; }
    .stat-label { font-size: 13px; color: #636e72; }
    .counts-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .count-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    .count-badge.paid { background: #e8f5e9; color: #2e7d32; }
    .count-badge.unpaid { background: #fff3e0; color: #e65100; }
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
    .data-table th { background: #faf9f6; font-weight: 600; color: #636e72; font-size: 12px; text-transform: uppercase; }
    .penalty { color: #e74c3c; }
    .total { font-weight: 600; }
    .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-paid { background: #e8f5e9; color: #2e7d32; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-late { background: #ffebee; color: #c62828; }
    .empty-state { text-align: center; padding: 64px; background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06); }
    .empty-state .material-icons { font-size: 56px; color: #ddd; margin-bottom: 16px; }
    .empty-state p { color: #636e72; }
  `]
})
export class MonthlyReportComponent implements OnInit {
  report: MonthlyReport | null = null;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  years = [2024, 2025, 2026, 2027, 2028];

  constructor(private reportService: FinancialReportService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.reportService.getMonthlyReport(this.month, this.year).subscribe({
      next: (data) => this.report = data,
      error: (err) => console.error('Error loading report', err)
    });
  }

  getMonthName(month: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1];
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'late': return 'En retard';
      default: return status;
    }
  }
}
