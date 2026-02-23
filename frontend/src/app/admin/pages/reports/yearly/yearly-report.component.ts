import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FinancialReportService, YearlyReport } from '../../../services/financial-report.service';

@Component({
  selector: 'app-yearly-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a routerLink="/admin/reports/dashboard" class="back-link">
          <span class="material-icons">arrow_back</span>
          Retour
        </a>
        <h1>Rapport Annuel</h1>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <label>Année</label>
          <select [(ngModel)]="year" (change)="loadReport()">
            <option *ngFor="let y of years" [value]="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <div class="summary-card" *ngIf="report">
        <div class="summary-content">
          <span class="summary-label">Revenu total pour {{ year }}</span>
          <span class="summary-value">{{ report.totalRevenue | number }} Ar</span>
        </div>
      </div>

      <div class="table-container" *ngIf="report">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mois</th>
              <th>Revenus</th>
              <th>Payés</th>
              <th>En attente</th>
              <th>Taux</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let month of report.monthlyBreakdown">
              <td>{{ getMonthName(month.month) }}</td>
              <td class="revenue">{{ month.revenue | number }} Ar</td>
              <td>
                <span class="badge success">{{ month.paidCount }}</span>
              </td>
              <td>
                <span class="badge warning">{{ month.unpaidCount }}</span>
              </td>
              <td>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="getRate(month)"></div>
                </div>
                <span class="rate">{{ getRate(month) | number:'1.0-0' }}%</span>
              </td>
            </tr>
          </tbody>
        </table>
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
    .summary-card {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
    }
    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .summary-label { color: rgba(255,255,255,0.7); font-size: 14px; }
    .summary-value { color: white; font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; }
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
    .revenue { font-weight: 600; color: #1a1a2e; }
    .badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .badge.success { background: #e8f5e9; color: #2e7d32; }
    .badge.warning { background: #fff3e0; color: #e65100; }
    .progress-bar {
      width: 100px;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    .progress { height: 100%; background: #00b894; }
    .rate { font-size: 13px; color: #636e72; }
  `]
})
export class YearlyReportComponent implements OnInit {
  report: YearlyReport | null = null;
  year = new Date().getFullYear();
  years = [2024, 2025, 2026, 2027, 2028];

  constructor(private reportService: FinancialReportService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.reportService.getYearlyReport(this.year).subscribe({
      next: (data) => this.report = data,
      error: (err) => console.error('Error loading report', err)
    });
  }

  getMonthName(month: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1];
  }

  getRate(month: { paidCount: number; unpaidCount: number }): number {
    const total = month.paidCount + month.unpaidCount;
    if (total === 0) return 0;
    return (month.paidCount / total) * 100;
  }
}
