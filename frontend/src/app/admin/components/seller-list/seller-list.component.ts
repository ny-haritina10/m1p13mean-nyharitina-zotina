import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSellerService, Seller, CreateSellerDto, UpdateSellerDto } from '../../services/admin-seller.service';

@Component({
  selector: 'app-seller-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="seller-list">
      <div class="header">
        <h1>Gestion des Vendeurs</h1>
        <div class="header-actions">
          <button class="btn-add" (click)="openCreateModal()">
            <span class="material-icons">add</span>
            Ajouter un vendeur
          </button>
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
                  class="btn-edit"
                  (click)="openEditModal(seller)"
                  title="Modifier"
                >
                  <span class="material-icons">edit</span>
                </button>
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

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Modifier le vendeur' : 'Ajouter un vendeur' }}</h2>
          <button class="modal-close" (click)="closeModal()">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="submitForm()">
            <div class="form-group">
              <label for="username">Nom d'utilisateur *</label>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="formData.username" 
                name="username"
                required
                [disabled]="isEditing"
                placeholder="Nom d'utilisateur"
              />
            </div>
            <div class="form-group" *ngIf="!isEditing">
              <label for="password">Mot de passe *</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="formData.password" 
                name="password"
                required
                placeholder="Mot de passe"
              />
            </div>
            <div class="form-group">
              <label for="boutiqueName">Nom de la boutique</label>
              <input 
                type="text" 
                id="boutiqueName" 
                [(ngModel)]="formData.boutiqueName" 
                name="boutiqueName"
                placeholder="Nom de la boutique"
              />
            </div>
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input 
                type="text" 
                id="phone" 
                [(ngModel)]="formData.phone" 
                name="phone"
                placeholder="Téléphone"
              />
            </div>
            <div class="form-group" *ngIf="isEditing">
              <label for="status">Statut</label>
              <select id="status" [(ngModel)]="formData.status" name="status">
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-submit" [disabled]="isSubmitting">
                {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </div>
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
    
    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .btn-add {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #10b981;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    
    .btn-add:hover {
      background: #059669;
    }
    
    .btn-add .material-icons {
      font-size: 20px;
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
    
    .btn-edit .material-icons {
      color: #3b82f6;
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
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .modal-header h2 {
      margin: 0;
      color: #1e293b;
      font-size: 18px;
    }
    
    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
    
    .modal-close:hover {
      background: #f1f5f9;
    }
    
    .modal-close .material-icons {
      font-size: 20px;
      color: #64748b;
    }
    
    .modal-body {
      padding: 24px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    .btn-cancel {
      padding: 10px 20px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #374151;
    }
    
    .btn-cancel:hover {
      background: #f9fafb;
    }
    
    .btn-submit {
      padding: 10px 20px;
      border: none;
      background: #3b82f6;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-submit:hover:not(:disabled) {
      background: #2563eb;
    }
    
    .btn-submit:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }
  `]
})
export class SellerListComponent implements OnInit {
  sellers: Seller[] = [];
  statusFilter = '';
  
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  editingSeller: Seller | null = null;
  
  formData: CreateSellerDto & UpdateSellerDto = {
    username: '',
    password: '',
    boutiqueName: '',
    phone: '',
    status: 'pending'
  };

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

  openCreateModal(): void {
    this.isEditing = false;
    this.editingSeller = null;
    this.formData = {
      username: '',
      password: '',
      boutiqueName: '',
      phone: '',
      status: 'pending'
    };
    this.showModal = true;
  }

  openEditModal(seller: Seller): void {
    this.isEditing = true;
    this.editingSeller = seller;
    this.formData = {
      username: seller.username,
      password: '',
      boutiqueName: seller.boutiqueName || '',
      phone: seller.phone || '',
      status: seller.status
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.editingSeller = null;
  }

  submitForm(): void {
    if (this.isEditing && this.editingSeller) {
      const updateData: UpdateSellerDto = {
        boutiqueName: this.formData.boutiqueName,
        phone: this.formData.phone,
        status: this.formData.status
      };
      
      this.isSubmitting = true;
      this.adminSellerService.updateSeller(this.editingSeller._id, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadSellers();
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(err.error?.error || 'Error updating seller');
        }
      });
    } else {
      this.isSubmitting = true;
      this.adminSellerService.createSeller(this.formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadSellers();
        },
        error: (err) => {
          this.isSubmitting = false;
          alert(err.error?.error || 'Error creating seller');
        }
      });
    }
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
