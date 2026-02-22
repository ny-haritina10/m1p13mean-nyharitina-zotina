import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSellerService, Seller } from '../../services/admin-seller.service';

@Component({
  selector: 'app-seller-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="seller-list">
      <div class="header">
        <h1>Gestion des Vendeurs</h1>
        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="loadSellers()" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
            <option value="suspended">Suspendu</option>
          </select>
          <button class="refresh-btn" (click)="loadSellers()">
            <span class="material-icons">refresh</span>
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="seller-table">
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Boutique</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let seller of sellers">
              <td>{{ seller.username }}</td>
              <td>{{ seller.boutiqueName || '-' }}</td>
              <td>{{ seller.phone || '-' }}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(seller.status)">
                  {{ getStatusLabel(seller.status) }}
                </span>
              </td>
              <td>{{ seller.createdAt | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button 
                  *ngIf="seller.status === 'pending'" 
                  class="btn-approve"
                  (click)="approveSeller(seller._id)"
                  title="Approuver"
                >
                  <span class="material-icons">check_circle</span>
                </button>
                <button 
                  *ngIf="seller.status === 'pending'" 
                  class="btn-reject"
                  (click)="rejectSeller(seller._id)"
                  title="Rejeter"
                >
                  <span class="material-icons">cancel</span>
                </button>
                <button 
                  *ngIf="seller.status === 'approved'" 
                  class="btn-suspend"
                  (click)="suspendSeller(seller._id)"
                  title="Suspendre"
                >
                  <span class="material-icons">block</span>
                </button>
                <button 
                  *ngIf="seller.status === 'suspended'" 
                  class="btn-reactivate"
                  (click)="reactivateSeller(seller._id)"
                  title="Réactiver"
                >
                  <span class="material-icons">replay</span>
                </button>
              </td>
            </tr>
            <tr *ngIf="sellers.length === 0">
              <td colspan="6" class="no-data">Aucun vendeur trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .seller-list {
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #1e293b;
      margin: 0;
    }
    
    .filters {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .filter-select {
      padding: 8px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
    }
    
    .refresh-btn {
      background: #3b82f6;
      border: none;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .refresh-btn .material-icons {
      color: white;
      font-size: 20px;
    }
    
    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    
    .seller-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .seller-table th,
    .seller-table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .seller-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #475569;
      font-size: 13px;
      text-transform: uppercase;
    }
    
    .seller-table td {
      color: #334155;
      font-size: 14px;
    }
    
    .seller-table tbody tr:hover {
      background: #f8fafc;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-pending {
      background: #fef3c7;
      color: #d97706;
    }
    
    .status-approved {
      background: #d1fae5;
      color: #059669;
    }
    
    .status-rejected {
      background: #e5e7eb;
      color: #6b7280;
    }
    
    .status-suspended {
      background: #fee2e2;
      color: #dc2626;
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    .actions button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    
    .actions button:hover {
      background: #f1f5f9;
    }
    
    .actions .material-icons {
      font-size: 20px;
    }
    
    .btn-approve .material-icons {
      color: #10b981;
    }
    
    .btn-reject .material-icons {
      color: #ef4444;
    }
    
    .btn-suspend .material-icons {
      color: #f59e0b;
    }
    
    .btn-reactivate .material-icons {
      color: #3b82f6;
    }
    
    .no-data {
      text-align: center;
      color: #94a3b8;
      padding: 40px !important;
    }
  `]
})
export class SellerListComponent implements OnInit {
  sellers: Seller[] = [];
  statusFilter = '';

  constructor(private adminSellerService: AdminSellerService) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.adminSellerService.getSellers(this.statusFilter || undefined)
      .subscribe({
        next: (data) => this.sellers = data,
        error: (err) => console.error('Error loading sellers:', err)
      });
  }

  approveSeller(id: string): void {
    if (confirm('Voulez-vous approuver ce vendeur?')) {
      this.adminSellerService.approveSeller(id).subscribe({
        next: () => this.loadSellers(),
        error: (err) => alert(err.error?.error || 'Error approving seller')
      });
    }
  }

  rejectSeller(id: string): void {
    if (confirm('Voulez-vous rejeter ce vendeur?')) {
      this.adminSellerService.rejectSeller(id).subscribe({
        next: () => this.loadSellers(),
        error: (err) => alert(err.error?.error || 'Error rejecting seller')
      });
    }
  }

  suspendSeller(id: string): void {
    if (confirm('Voulez-vous suspendre ce vendeur?')) {
      this.adminSellerService.suspendSeller(id).subscribe({
        next: () => this.loadSellers(),
        error: (err) => alert(err.error?.error || 'Error suspending seller')
      });
    }
  }

  reactivateSeller(id: string): void {
    if (confirm('Voulez-vous réactiver ce vendeur?')) {
      this.adminSellerService.reactivateSeller(id).subscribe({
        next: () => this.loadSellers(),
        error: (err) => alert(err.error?.error || 'Error reactivating seller')
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      suspended: 'Suspendu'
    };
    return labels[status] || status;
  }
}
