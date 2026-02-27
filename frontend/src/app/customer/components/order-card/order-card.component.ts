import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderStatusBadgeComponent } from '../order-status-badge/order-status-badge.component';
import { OrderSummary } from '../../services/order.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderStatusBadgeComponent],
  template: `
    <div class="order-card">
      <div class="order-header">
        <div class="order-number">{{ order.orderNumber }}</div>
        <app-order-status-badge [status]="order.globalStatus"></app-order-status-badge>
      </div>
      
      <div class="order-details">
        <div class="order-date">
          <span class="material-icons">calendar_today</span>
          {{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}
        </div>
        <div class="order-amount">
          <span class="material-icons">payments</span>
          {{ order.totalAmount | number:'1.0-0' }} Ar
        </div>
      </div>
      
      <a [routerLink]="['/orders', order.orderId]" class="btn-details">
        Voir détail
        <span class="material-icons">arrow_forward</span>
      </a>
    </div>
  `,
  styles: [`
    .order-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .order-number {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .order-details {
      display: flex;
      gap: 24px;
      margin-bottom: 16px;
      color: #636e72;
      font-size: 14px;
    }

    .order-date, .order-amount {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .order-date .material-icons, .order-amount .material-icons {
      font-size: 18px;
      color: #b2bec3;
    }

    .order-amount {
      font-weight: 600;
      color: #2d3436;
    }

    .btn-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: #f8f9fa;
      color: #e94560;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .btn-details:hover {
      background: #e94560;
      color: white;
    }

    .btn-details .material-icons {
      font-size: 18px;
    }

    @media (max-width: 640px) {
      .order-details {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class OrderCardComponent {
  @Input() order!: OrderSummary;
}
