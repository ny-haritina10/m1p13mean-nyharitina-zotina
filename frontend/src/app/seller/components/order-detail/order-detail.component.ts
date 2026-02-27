import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SellerOrderService, Order } from '../../services/seller-order.service';
import { OrderStatusBadgeComponent } from './order-status-badge.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, OrderStatusBadgeComponent],
  template: `
    <div class="detail-container" *ngIf="order">
      <div class="page-header">
        <div>
          <h1>📦 Commande {{ order.orderNumber }}</h1>
          <p>Détails de la commande</p>
        </div>
        <button (click)="back()" class="btn-back">
          <span class="material-icons">arrow_back</span>
          Retour
        </button>
      </div>

      <div class="content-grid">
        <!-- Order Info -->
        <div class="card">
          <div class="card-header">
            <h2>📋 Informations</h2>
            <app-order-status-badge [status]="order.orderStatus"></app-order-status-badge>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">Date :</span>
              <span class="value">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Client :</span>
              <span class="value">{{ order.customer?.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Téléphone :</span>
              <span class="value">{{ order.customer?.phone }}</span>
            </div>
            <div class="info-row">
              <span class="label">Paiement :</span>
              <span class="value">{{ getPaymentMethod(order.paymentMethod) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Montant :</span>
              <span class="value amount">{{ order.totalAmount | number:'1.0-0' }} Ar</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="card">
          <div class="card-header">
            <h2>⚙️ Actions</h2>
          </div>
          <div class="card-body">
            <div class="action-buttons">
              <button
                *ngIf="order.orderStatus === 'pending'"
                (click)="validateOrder()"
                class="btn btn-validate">
                <span class="material-icons">check_circle</span>
                Valider
              </button>

              <button
                *ngIf="order.orderStatus === 'validated'"
                (click)="updateStatus('preparing')"
                class="btn btn-preparing">
                <span class="material-icons">cook</span>
                En préparation
              </button>

              <button
                *ngIf="order.orderStatus === 'preparing'"
                (click)="updateStatus('ready')"
                class="btn btn-ready">
                <span class="material-icons">check</span>
                Prête
              </button>

              <button
                *ngIf="order.orderStatus === 'ready'"
                (click)="updateStatus('delivered')"
                class="btn btn-delivered">
                <span class="material-icons">local_shipping</span>
                Livrée
              </button>

              <button
                *ngIf="['pending', 'validated'].includes(order.orderStatus)"
                (click)="showCancelModal = true"
                class="btn btn-cancel">
                <span class="material-icons">cancel</span>
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="card">
        <div class="card-header">
          <h2>📦 Produits</h2>
        </div>
        <div class="card-body">
          <table class="products-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Sous-total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of order.products">
                <td>
                  <div class="product-info">
                    <div class="product-image" *ngIf="item.product.images?.[0]">
                      <img [src]="item.product.images![0]" [alt]="item.product.name" />
                    </div>
                    <div class="product-image" *ngIf="!item.product.images?.[0]">
                      <span class="material-icons">image</span>
                    </div>
                    <span class="product-name">{{ item.product.name }}</span>
                  </div>
                </td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unitPrice | number:'1.0-0' }} Ar</td>
                <td class="amount">{{ item.subtotal | number:'1.0-0' }} Ar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Status History -->
      <div class="card">
        <div class="card-header">
          <h2>📜 Historique des statuts</h2>
        </div>
        <div class="card-body">
          <div class="timeline">
            <div
              *ngFor="let history of order.statusHistory"
              class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="status-text">{{ getStatusLabel(history.status) }}</span>
                  <span class="time-text">{{ history.changedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="timeline-notes" *ngIf="history.notes">
                  {{ history.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Internal Notes -->
      <div class="card">
        <div class="card-header">
          <h2>📝 Notes internes</h2>
        </div>
        <div class="card-body">
          <textarea
            [(ngModel)]="internalNotes"
            [ngModel]="order.internalNotes"
            (ngModelChange)="internalNotes = $event"
            rows="4"
            placeholder="Ajoutez des notes internes..."
            class="notes-textarea">
          </textarea>
          <button (click)="saveInternalNotes()" class="btn btn-save-notes">
            <span class="material-icons">save</span>
            Enregistrer
          </button>
        </div>
      </div>

      <!-- Cancel Modal -->
      <div *ngIf="showCancelModal" class="modal-overlay" (click)="showCancelModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>❌ Annuler la commande</h2>
            <button (click)="showCancelModal = false" class="btn-close">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Motif d'annulation *</label>
              <select [(ngModel)]="cancelReason">
                <option value="">Sélectionner un motif</option>
                <option value="out_of_stock">Rupture de stock</option>
                <option value="customer_request">Demande client</option>
                <option value="payment_issue">Problème de paiement</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Notes (optionnel)</label>
              <textarea
                [(ngModel)]="cancelNotes"
                rows="3"
                placeholder="Précisions sur l'annulation...">
              </textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="showCancelModal = false" class="btn-cancel">Retour</button>
            <button (click)="cancelOrder()" class="btn-confirm" [disabled]="!cancelReason">
              Confirmer l'annulation
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
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

    .btn-back {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }

    .card-header {
      padding: 20px 24px;
      background: #faf9f6;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    .card-body {
      padding: 24px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #636e72;
      font-size: 14px;
    }

    .value {
      font-weight: 600;
      color: #1a1a2e;
    }

    .value.amount {
      color: #e94560;
      font-size: 18px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-validate {
      background: #3498db;
      color: white;
    }

    .btn-preparing {
      background: #9b59b6;
      color: white;
    }

    .btn-ready {
      background: #27ae60;
      color: white;
    }

    .btn-delivered {
      background: #1abc9c;
      color: white;
    }

    .btn-cancel {
      background: #e74c3c;
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      background: #faf9f6;
      padding: 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
    }

    .products-table td {
      padding: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      background: #faf9f6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-image .material-icons {
      color: #b2bec3;
      font-size: 24px;
    }

    .product-name {
      font-weight: 600;
      color: #1a1a2e;
    }

    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 24px;
    }

    .timeline-item:last-child {
      padding-bottom: 0;
    }

    .timeline-marker {
      position: absolute;
      left: -30px;
      top: 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #667eea;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #667eea;
    }

    .timeline-content {
      background: #faf9f6;
      padding: 16px;
      border-radius: 12px;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .status-text {
      font-weight: 600;
      color: #1a1a2e;
    }

    .time-text {
      font-size: 13px;
      color: #636e72;
    }

    .timeline-notes {
      font-size: 14px;
      color: #636e72;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .notes-textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.3s;
    }

    .notes-textarea:focus {
      outline: none;
      border-color: #e94560;
    }

    .btn-save-notes {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 16px;
      padding: 32px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      color: #1a1a2e;
      margin: 0;
    }

    .btn-close {
      width: 36px;
      height: 36px;
      border: none;
      background: #f0f0f0;
      color: #636e72;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #636e72;
      margin-bottom: 8px;
    }

    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #e94560;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-cancel {
      padding: 12px 24px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-confirm {
      padding: 12px 24px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-confirm:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  internalNotes = '';
  showCancelModal = false;
  cancelReason = '';
  cancelNotes = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: SellerOrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    }
  }

  loadOrder(id: string): void {
    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.internalNotes = order.internalNotes || '';
      },
      error: (err) => {
        console.error('Error loading order:', err);
      }
    });
  }

  back(): void {
    this.router.navigate(['/seller/orders']);
  }

  validateOrder(): void {
    if (!this.order?._id) return;
    
    this.orderService.validateOrder(this.order._id, 'Commande validée').subscribe({
      next: () => {
        this.loadOrder(this.order!._id!);
      },
      error: (err) => {
        console.error('Error validating order:', err);
        alert('Erreur lors de la validation: ' + (err.error?.error || 'Erreur inconnue'));
      }
    });
  }

  updateStatus(status: string): void {
    if (!this.order?._id) return;
    
    const notes = `Statut mis à jour: ${status}`;
    this.orderService.updateOrderStatus(this.order._id, status, notes).subscribe({
      next: () => {
        this.loadOrder(this.order!._id!);
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Erreur: ' + (err.error?.error || 'Erreur inconnue'));
      }
    });
  }

  cancelOrder(): void {
    if (!this.order?._id || !this.cancelReason) return;
    
    this.orderService.cancelOrder(this.order._id, this.cancelReason, this.cancelNotes).subscribe({
      next: () => {
        this.showCancelModal = false;
        this.cancelReason = '';
        this.cancelNotes = '';
        this.loadOrder(this.order!._id!);
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
        alert('Erreur: ' + (err.error?.error || 'Erreur inconnue'));
      }
    });
  }

  saveInternalNotes(): void {
    if (!this.order?._id) return;
    
    this.orderService.addInternalNote(this.order._id, this.internalNotes).subscribe({
      next: () => {
        alert('✅ Notes enregistrées');
      },
      error: (err) => {
        console.error('Error saving notes:', err);
        alert('Erreur lors de l\'enregistrement');
      }
    });
  }

  getPaymentMethod(method: string): string {
    const labels: any = {
      cash: 'Espèces',
      mobile_money: 'Mobile Money',
      card: 'Carte'
    };
    return labels[method] || method;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'En attente',
      validated: 'Validée',
      preparing: 'En préparation',
      ready: 'Prête',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  }
}
