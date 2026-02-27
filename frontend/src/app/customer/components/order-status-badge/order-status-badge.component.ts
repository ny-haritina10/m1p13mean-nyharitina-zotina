import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="status.toLowerCase()">
      {{ getStatusLabel(status) }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pending {
      background: #f3f4f6;
      color: #6b7280;
    }

    .in_progress {
      background: #dbeafe;
      color: #2563eb;
    }

    .ready {
      background: #fef3c7;
      color: #d97706;
    }

    .completed {
      background: #d1fae5;
      color: #059669;
    }

    .cancelled {
      background: #fee2e2;
      color: #dc2626;
    }
  `]
})
export class OrderStatusBadgeComponent {
  @Input() status: string = 'PENDING';

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'En attente',
      'IN_PROGRESS': 'En cours',
      'READY': 'Prêt',
      'COMPLETED': 'Livré',
      'CANCELLED': 'Annulé'
    };
    return labels[status] || status;
  }
}
