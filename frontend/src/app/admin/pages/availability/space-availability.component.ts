import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpaceAvailabilityService, AvailabilitySummary, RentalSpace } from '../../services/space-availability.service';

@Component({
  selector: 'app-space-availability',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Disponibilité des Espaces</h1>
        <button class="btn-sync" (click)="syncStatus()" [disabled]="syncing">
          <span class="material-icons">sync</span>
          {{ syncing ? 'Synchronisation...' : 'Synchroniser' }}
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon"><span class="material-icons">meeting_room</span></div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.totalSpaces }}</span>
            <span class="stat-label">Total Espaces</span>
          </div>
        </div>
        <div class="stat-card available">
          <div class="stat-icon"><span class="material-icons">check_circle</span></div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.available }}</span>
            <span class="stat-label">Disponibles</span>
          </div>
        </div>
        <div class="stat-card occupied">
          <div class="stat-icon"><span class="material-icons">person</span></div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.occupied }}</span>
            <span class="stat-label">Occupés</span>
          </div>
        </div>
        <div class="stat-card maintenance">
          <div class="stat-icon"><span class="material-icons">build</span></div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.maintenance }}</span>
            <span class="stat-label">Maintenance</span>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'available'" (click)="activeTab = 'available'">
          Disponibles ({{ spacesByStatus?.availableSpaces?.length || 0 }})
        </button>
        <button [class.active]="activeTab === 'occupied'" (click)="activeTab = 'occupied'">
          Occupés ({{ spacesByStatus?.occupiedSpaces?.length || 0 }})
        </button>
        <button [class.active]="activeTab === 'maintenance'" (click)="activeTab = 'maintenance'">
          Maintenance ({{ spacesByStatus?.maintenanceSpaces?.length || 0 }})
        </button>
      </div>

      <div class="table-container">
        <table class="data-table" *ngIf="currentSpaces.length > 0; else noSpaces">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Étage</th>
              <th>Surface</th>
              <th>Prix Mensuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let space of currentSpaces">
              <td>{{ space.name }}</td>
              <td>{{ getTypeLabel(space.type) }}</td>
              <td>{{ space.floor === 0 ? 'Rez-de-chaussée' : 'Étage ' + space.floor }}</td>
              <td>{{ space.surface ? space.surface + ' m²' : '-' }}</td>
              <td>{{ space.monthlyPrice | number }} Ar</td>
              <td>
                <button *ngIf="space.status === 'available'" 
                        class="btn-action maintenance" 
                        (click)="setMaintenance(space._id)"
                        title="Mettre en maintenance">
                  <span class="material-icons">build</span>
                </button>
                <button *ngIf="space.status === 'maintenance'" 
                        class="btn-action restore" 
                        (click)="removeMaintenance(space._id)"
                        title="Retirer maintenance">
                  <span class="material-icons">restore</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noSpaces>
          <div class="empty-state">
            <span class="material-icons">inbox</span>
            <p>Aucun espace dans cette catégorie</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
    }
    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700;
      color: #1a1a2e; margin: 0;
    }
    .btn-sync {
      display: flex; align-items: center; gap: 8px; padding: 10px 20px;
      background: #3b82f6; color: white; border: none; border-radius: 10px;
      cursor: pointer; font-size: 14px; font-weight: 500;
    }
    .btn-sync:hover { background: #2563eb; }
    .btn-sync:disabled { opacity: 0.6; cursor: not-allowed; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;
    }
    .stat-card {
      background: white; border-radius: 16px; padding: 24px; display: flex;
      align-items: center; gap: 16px; box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .stat-icon {
      width: 56px; height: 56px; border-radius: 14px; display: flex;
      align-items: center; justify-content: center;
    }
    .stat-icon .material-icons { font-size: 28px; }
    .stat-card.total .stat-icon { background: #eff6ff; }
    .stat-card.total .stat-icon .material-icons { color: #3b82f6; }
    .stat-card.available .stat-icon { background: #dcfce7; }
    .stat-card.available .stat-icon .material-icons { color: #16a34a; }
    .stat-card.occupied .stat-icon { background: #fef3c7; }
    .stat-card.occupied .stat-icon .material-icons { color: #d97706; }
    .stat-card.maintenance .stat-icon { background: #f1f5f9; }
    .stat-card.maintenance .stat-icon .material-icons { color: #64748b; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1a1a2e; }
    .stat-label { font-size: 14px; color: #636e72; }
    .tabs {
      display: flex; gap: 8px; margin-bottom: 20px; background: white;
      padding: 8px; border-radius: 12px; box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .tabs button {
      flex: 1; padding: 12px 20px; border: none; background: transparent;
      border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500;
      color: #636e72; transition: all 0.2s;
    }
    .tabs button.active { background: #3b82f6; color: white; }
    .table-container { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06); }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 16px; text-align: left; border-bottom: 1px solid #eee; }
    .data-table th { background: #f8fafc; font-weight: 600; color: #475569; font-size: 13px; text-transform: uppercase; }
    .data-table tr:hover { background: #f8fafc; }
    .data-table tr:last-child td { border-bottom: none; }
    .btn-action {
      width: 36px; height: 36px; border: none; border-radius: 8px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .btn-action.maintenance { background: #fef3c7; }
    .btn-action.maintenance .material-icons { color: #d97706; font-size: 18px; }
    .btn-action.restore { background: #dcfce7; }
    .btn-action.restore .material-icons { color: #16a34a; font-size: 18px; }
    .empty-state { text-align: center; padding: 48px; color: #94a3b8; }
    .empty-state .material-icons { font-size: 48px; margin-bottom: 16px; }
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class SpaceAvailabilityComponent implements OnInit {
  summary: AvailabilitySummary = { totalSpaces: 0, available: 0, occupied: 0, maintenance: 0 };
  spacesByStatus: any = null;
  activeTab: 'available' | 'occupied' | 'maintenance' = 'available';
  syncing = false;

  constructor(private availabilityService: SpaceAvailabilityService) {}

  ngOnInit() {
    this.loadData();
  }

  get currentSpaces(): RentalSpace[] {
    switch (this.activeTab) {
      case 'available': return this.spacesByStatus?.availableSpaces || [];
      case 'occupied': return this.spacesByStatus?.occupiedSpaces || [];
      case 'maintenance': return this.spacesByStatus?.maintenanceSpaces || [];
      default: return [];
    }
  }

  loadData() {
    this.availabilityService.getSpacesByStatus().subscribe({
      next: (data) => {
        this.spacesByStatus = data;
        this.summary = data.summary;
      },
      error: (err) => console.error('Error loading availability', err)
    });
  }

  syncStatus() {
    this.syncing = true;
    this.availabilityService.syncStatus().subscribe({
      next: () => {
        this.loadData();
        this.syncing = false;
      },
      error: () => this.syncing = false
    });
  }

  setMaintenance(spaceId: string) {
    this.availabilityService.setMaintenance(spaceId).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error setting maintenance', err)
    });
  }

  removeMaintenance(spaceId: string) {
    this.availabilityService.removeMaintenance(spaceId).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error removing maintenance', err)
    });
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'box': return 'Box';
      case 'kiosque': return 'Kiosque';
      case 'stand': return 'Stand';
      default: return type;
    }
  }
}
