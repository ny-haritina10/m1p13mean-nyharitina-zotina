import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminContractService, Contract } from '../../../services/admin-contract.service';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Liste des Contrats</h1>
        <a routerLink="/admin/contracts/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouveau Contrat
        </a>
      </div>

      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="loadContracts()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="expired">Expiré</option>
          <option value="terminated">Résilié</option>
        </select>
      </div>

      <div class="table-container" *ngIf="contracts.length > 0; else noContracts">
        <table class="data-table">
          <thead>
            <tr>
              <th>Boutique</th>
              <th>Espace</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Loyer Mensuel</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let contract of contracts">
              <td>{{ contract.seller?.boutiqueName || contract.seller?.username }}</td>
              <td>{{ contract.rentalSpace?.name }}</td>
              <td>{{ contract.startDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ contract.endDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ contract.monthlyRent | number }} Ar</td>
              <td>
                <span class="status-badge" [class]="getStatusClass(contract.status)">
                  {{ getStatusLabel(contract.status) }}
                </span>
              </td>
              <td class="actions">
                <button *ngIf="contract.status === 'active'" 
                        class="btn-danger" 
                        (click)="terminateContract(contract._id)">
                  Résilier
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noContracts>
        <div class="empty-state">
          <span class="material-icons">description</span>
          <p>Aucun contrat trouvé</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 24px;
    }
    .page-header h1 { margin: 0; font-size: 24px; color: #1e293b; }
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      font-size: 14px;
    }
    .btn-primary:hover { background: #2563eb; }
    .filters { margin-bottom: 16px; }
    .filter-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
    }
    .table-container { overflow-x: auto; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .data-table th, .data-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table th { background: #f8fafc; font-weight: 600; color: #475569; }
    .data-table tr:hover { background: #f8fafc; }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-active { background: #dcfce7; color: #166534; }
    .status-expired { background: #fee2e2; color: #991b1b; }
    .status-terminated { background: #f1f5f9; color: #475569; }
    .btn-danger {
      padding: 6px 12px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    .btn-danger:hover { background: #dc2626; }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #94a3b8;
    }
    .empty-state .material-icons { font-size: 48px; margin-bottom: 16px; }
  `]
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];
  statusFilter = '';

  constructor(private contractService: AdminContractService) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getContracts(this.statusFilter || undefined).subscribe({
      next: (data) => this.contracts = data,
      error: (err) => console.error('Error loading contracts', err)
    });
  }

  terminateContract(id: string) {
    if (confirm('Êtes-vous sûr de vouloir résilier ce contrat?')) {
      this.contractService.terminateContract(id).subscribe({
        next: () => this.loadContracts(),
        error: (err) => console.error('Error terminating contract', err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'expired': return 'status-expired';
      case 'terminated': return 'status-terminated';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'expired': return 'Expiré';
      case 'terminated': return 'Résilié';
      default: return status;
    }
  }
}
