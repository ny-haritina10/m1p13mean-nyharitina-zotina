import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <span class="material-icons">{{ icon }}</span>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      width: 100px;
      height: 100px;
      background: #f3f4f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .empty-icon .material-icons {
      font-size: 48px;
      color: #9ca3af;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    p {
      color: #6b7280;
      font-size: 15px;
      margin: 0;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inventory_2';
  @Input() title = 'Aucun résultat';
  @Input() message = 'Essayez avec d\'autres mots-clés';
}
