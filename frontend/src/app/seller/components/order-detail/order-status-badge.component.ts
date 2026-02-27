import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [class]="statusClass">
      {{ statusLabel }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f39c12;
    }

    .status-badge.validated {
      background: #e3f2fd;
      color: #3498db;
    }

    .status-badge.preparing {
      background: #f3e5f5;
      color: #9b59b6;
    }

    .status-badge.ready {
      background: #e8f5e9;
      color: #27ae60;
    }

    .status-badge.delivered {
      background: #e0f2f1;
      color: #1abc9c;
    }

    .status-badge.cancelled {
      background: #f5f5f5;
      color: #636e72;
    }
  `]
})
export class OrderStatusBadgeComponent {
  @Input() status: string = 'pending';

  get statusClass(): string {
    return this.status;
  }

  get statusLabel(): string {
    const labels: any = {
      pending: 'En attente',
      validated: 'Validée',
      preparing: 'En préparation',
      ready: 'Prête',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[this.status] || this.status;
  }
}
