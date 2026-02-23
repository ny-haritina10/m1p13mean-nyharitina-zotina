import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FinancialReportService, RevenueSummary } from '../../../services/financial-report.service';

@Component({
  selector: 'app-financial-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Tableau de Bord Financier</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ summary.totalExpected | number }} Ar</span>
            <span class="stat-label">Revenu total attendu</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon green">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ summary.totalCollected | number }} Ar</span>
            <span class="stat-label">Revenu collecté</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orange">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ summary.totalUnpaid | number }} Ar</span>
            <span class="stat-label">Montant impayé</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon purple">
            <span class="material-icons">percent</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ summary.collectionRate }}%</span>
            <span class="stat-label">Taux de collecte</span>
          </div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-card">
          <h3>Revenus du mois en cours</h3>
          <div class="big-number">
            <span class="amount">{{ summary.currentMonthRevenue | number }} Ar</span>
          </div>
        </div>
        
        <div class="chart-card">
          <h3>Revenus de l'année</h3>
          <div class="big-number">
            <span class="amount">{{ summary.yearlyRevenue | number }} Ar</span>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-card">
          <div class="detail-header">
            <span class="material-icons">check_circle</span>
            <span>Paiements effectués</span>
          </div>
          <div class="detail-value">{{ summary.paidCount }}</div>
        </div>
        
        <div class="detail-card">
          <div class="detail-header">
            <span class="material-icons">pending</span>
            <span>En attente</span>
          </div>
          <div class="detail-value">{{ summary.pendingCount }}</div>
        </div>
        
        <div class="detail-card">
          <div class="detail-header">
            <span class="material-icons">warning</span>
            <span>En retard</span>
          </div>
          <div class="detail-value">{{ summary.lateCount }}</div>
        </div>
      </div>

      <div class="actions-row">
        <a routerLink="/admin/reports/monthly" class="action-card">
          <span class="material-icons">calendar_month</span>
          <span>Rapport mensuel</span>
        </a>
        <a routerLink="/admin/reports/yearly" class="action-card">
          <span class="material-icons">calendar_today</span>
          <span>Rapport annuel</span>
        </a>
        <a routerLink="/admin/rents" class="action-card">
          <span class="material-icons">payments</span>
          <span>Gestion des loyers</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
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
    .stat-icon.purple { background: #8b5cf6; }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .stat-label { font-size: 13px; color: #636e72; }
    .charts-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .chart-card h3 {
      font-size: 14px;
      color: #636e72;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .big-number .amount {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 36px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    .detail-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .detail-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #636e72;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .detail-header .material-icons { font-size: 20px; }
    .detail-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .actions-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .action-card {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      text-decoration: none;
      color: #1a1a2e;
      font-weight: 600;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
      transition: var(--transition);
    }
    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(26, 26, 46, 0.1);
    }
    .action-card .material-icons { font-size: 28px; color: #e94560; }
  `]
})
export class FinancialDashboardComponent implements OnInit {
  summary: RevenueSummary = {
    totalExpected: 0,
    totalCollected: 0,
    totalUnpaid: 0,
    paidCount: 0,
    pendingCount: 0,
    lateCount: 0,
    currentMonthRevenue: 0,
    yearlyRevenue: 0,
    collectionRate: '0'
  };

  constructor(private reportService: FinancialReportService) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.reportService.getRevenueSummary().subscribe({
      next: (data) => this.summary = data,
      error: (err) => console.error('Error loading summary', err)
    });
  }
}
