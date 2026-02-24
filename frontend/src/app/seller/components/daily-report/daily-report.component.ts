import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleService, DailyReport } from '../../services/sale.service';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-container">
      <div class="page-header">
        <div>
          <h1>📊 Rapport Quotidien</h1>
          <p>Suivi des ventes par jour</p>
        </div>
        <button (click)="printReport()" class="btn-primary">
          <span class="material-icons">print</span>
          Imprimer
        </button>
      </div>

      <!-- Date Selector -->
      <div class="date-selector">
        <label>Date</label>
        <input type="date" [(ngModel)]="selectedDate" (ngModelChange)="loadReport()" />
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid" *ngIf="report">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">{{ report.totalRevenue | number:'1.0-0' }} Ar</div>
          <div class="stat-label">Chiffre d'affaires</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-value">{{ report.totalSales }}</div>
          <div class="stat-label">Ventes</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-value">{{ report.totalItems }}</div>
          <div class="stat-label">Articles vendus</div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="section" *ngIf="report && report.paymentMethods">
        <h2>💳 Méthodes de paiement</h2>
        <div class="payment-grid">
          <div *ngFor="let method of paymentMethods" class="payment-card">
            <div class="payment-name">{{ method.name }}</div>
            <div class="payment-amount">{{ method.amount | number:'1.0-0' }} Ar</div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="section" *ngIf="report && report.topProducts && report.topProducts.length > 0">
        <h2>🏆 Top Produits</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Revenu</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of report.topProducts">
              <td>{{ p.productName }}</td>
              <td>{{ p.quantity }}</td>
              <td class="amount">{{ p.revenue | number:'1.0-0' }} Ar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!report || (report.totalSales === 0 && (!report.topProducts || report.topProducts.length === 0))">
        <span class="material-icons">receipt_long</span>
        <h3>Aucune vente ce jour</h3>
        <p>Les ventes apparaîtront ici</p>
      </div>
    </div>
  `,
  styles: [`
    .report-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

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
      margin-bottom: 4px;
    }

    .date-selector {
      margin-bottom: 32px;
    }

    .date-selector label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #636e72;
      margin-bottom: 8px;
    }

    .date-selector input {
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      text-align: center;
    }

    .stat-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #636e72;
    }

    .section {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }

    .section h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 20px;
    }

    .payment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .payment-card {
      padding: 16px;
      background: #faf9f6;
      border-radius: 12px;
      text-align: center;
    }

    .payment-name {
      font-size: 14px;
      color: #636e72;
      margin-bottom: 8px;
    }

    .payment-amount {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      background: #faf9f6;
      padding: 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
    }

    .table td {
      padding: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .amount {
      font-weight: 700;
      color: #1a1a2e;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .empty-state .material-icons {
      font-size: 72px;
      color: #b2bec3;
      margin-bottom: 16px;
    }
  `]
})
export class DailyReportComponent implements OnInit {
  selectedDate = new Date().toISOString().split('T')[0];
  report: DailyReport | null = null;

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.saleService.getDailyReport(this.selectedDate).subscribe({
      next: (data) => {
        this.report = data;
      },
      error: (err) => {
        console.error('Error loading report:', err);
      }
    });
  }

  get paymentMethods(): { name: string; amount: number }[] {
    if (!this.report?.paymentMethods) return [];
    return Object.entries(this.report.paymentMethods).map(([key, value]) => ({
      name: this.getPaymentMethodName(key),
      amount: value
    }));
  }

  getPaymentMethodName(key: string): string {
    const names: any = {
      cash: 'Espèces',
      mobile_money: 'Mobile Money',
      card: 'Carte',
      mixed: 'Mixte'
    };
    return names[key] || key;
  }

  printReport(): void {
    window.print();
  }
}
