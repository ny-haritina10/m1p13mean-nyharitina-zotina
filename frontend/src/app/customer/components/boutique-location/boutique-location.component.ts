import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boutique-location',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="location-container" *ngIf="hasLocation">
      <div class="location-icon">
        <span class="material-icons">location_on</span>
      </div>
      <div class="location-info">
        <span class="label">Disponible chez</span>
        <span class="boutique-name">{{ boutiqueName }}</span>
        <a class="location-details" (click)="onMapClick()">
          <span class="zone">{{ zone }}</span>
          <span class="separator">–</span>
          <span class="floor">{{ floor }}</span>
          <span class="separator">–</span>
          <span class="unit">Boutique {{ unitNumber }}</span>
        </a>
      </div>
    </div>
    <div class="location-container" *ngIf="!hasLocation">
      <div class="location-icon">
        <span class="material-icons">store</span>
      </div>
      <div class="location-info">
        <span class="label">Disponible chez</span>
        <span class="boutique-name">{{ boutiqueName }}</span>
      </div>
    </div>
  `,
  styles: [`
    .location-container {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .location-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: #e0e7ff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .location-icon .material-icons {
      color: #4f46e5;
      font-size: 22px;
    }

    .location-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .boutique-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .location-details {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #4f46e5;
      text-decoration: none;
      cursor: pointer;
      margin-top: 4px;
    }

    .location-details:hover {
      text-decoration: underline;
    }

    .separator {
      color: #9ca3af;
    }

    .zone, .floor, .unit {
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .location-container {
        padding: 12px;
      }

      .location-icon {
        width: 36px;
        height: 36px;
      }

      .boutique-name {
        font-size: 15px;
      }
    }
  `]
})
export class BoutiqueLocationComponent {
  @Input() boutiqueName: string = '';
  @Input() zone: string | null = null;
  @Input() floor: string | null = null;
  @Input() unitNumber: string | null = null;

  get hasLocation(): boolean {
    return !!(this.zone || this.floor || this.unitNumber);
  }

  onMapClick(): void {
    console.log('Navigate to mall map - TODO');
  }
}
