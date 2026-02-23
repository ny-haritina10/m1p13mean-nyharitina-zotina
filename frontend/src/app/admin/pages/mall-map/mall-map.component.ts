import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MallMapService } from '../../services/mall-map.service';

interface MapSpace {
  id: string;
  name: string;
  type: 'box' | 'kiosque' | 'stand';
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  location?: string;
  surface?: number;
  monthlyPrice: number;
  x: number;
  y: number;
  width: number;
  height: number;
  currentContract?: {
    seller: { username: string; boutiqueName?: string };
    startDate: string;
    endDate: string;
    monthlyRent: number;
  };
}

interface SpaceDetails {
  id: string;
  name: string;
  type: string;
  floor: number;
  location: string;
  surface: number;
  monthlyPrice: number;
  status: string;
  mapPosition: { x: number; y: number };
  width: number;
  height: number;
  currentContract: any;
  contractHistory: any[];
}

@Component({
  selector: 'app-mall-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Plan Interactif du Centre Commercial</h1>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <label>Étage</label>
          <select [(ngModel)]="selectedFloor" (change)="loadMap()">
            <option *ngFor="let floor of floors" [value]="floor">Étage {{ floor }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Type</label>
          <select [(ngModel)]="typeFilter" (change)="applyFilters()">
            <option value="">Tous</option>
            <option value="box">Box</option>
            <option value="kiosque">Kiosque</option>
            <option value="stand">Stand</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Statut</label>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()">
            <option value="">Tous</option>
            <option value="available">Disponible</option>
            <option value="occupied">Occupé</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div class="legend">
          <span class="legend-item"><span class="dot available"></span> Disponible</span>
          <span class="legend-item"><span class="dot occupied"></span> Occupé</span>
          <span class="legend-item"><span class="dot maintenance"></span> Maintenance</span>
        </div>
      </div>

      <div class="map-container">
        <svg class="map-svg" viewBox="0 0 800 600">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eee" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          
          <g class="spaces">
            <ng-container *ngFor="let space of filteredSpaces">
              <rect
                [attr.x]="space.x"
                [attr.y]="space.y"
                [attr.width]="space.width"
                [attr.height]="space.height"
                [class]="'space-rect ' + space.status"
                (click)="openSpaceDetails(space)"
              />
              <text
                [attr.x]="space.x + space.width/2"
                [attr.y]="space.y + space.height/2"
                class="space-label"
              >
                {{ space.name }}
              </text>
            </ng-container>
          </g>
        </svg>
      </div>

      <div class="modal-overlay" *ngIf="selectedSpace" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ selectedSpace.name }}</h2>
            <button class="close-btn" (click)="closeModal()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="value">{{ getTypeLabel(selectedSpace.type) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Étage:</span>
              <span class="value">{{ selectedSpace.floor }}</span>
            </div>
            <div class="info-row">
              <span class="label">Statut:</span>
              <span class="status-badge" [class]="'status-' + selectedSpace.status">
                {{ getStatusLabel(selectedSpace.status) }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Surface:</span>
              <span class="value">{{ selectedSpace.surface || '-' }} m²</span>
            </div>
            <div class="info-row">
              <span class="label">Prix mensuel:</span>
              <span class="value">{{ selectedSpace.monthlyPrice | number }} Ar</span>
            </div>
            
            <div *ngIf="selectedSpace.currentContract" class="contract-info">
              <h3>Contrat en cours</h3>
              <div class="info-row">
                <span class="label">Locataire:</span>
                <span class="value">{{ selectedSpace.currentContract.seller.boutiqueName || selectedSpace.currentContract.seller.username }}</span>
              </div>
              <div class="info-row">
                <span class="label">Loyer:</span>
                <span class="value">{{ selectedSpace.currentContract.monthlyRent | number }} Ar</span>
              </div>
            </div>
            
            <div *ngIf="!selectedSpace.currentContract && selectedSpace.status !== 'occupied'" class="no-contract">
              <span class="material-icons">info</span>
              Aucun contrat actif
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }
    .filters-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 14px;
      align-items: flex-end;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
    }
    .filter-group { display: flex; flex-direction: column; gap: 6px; }
    .filter-group label { font-size: 12px; font-weight: 600; color: #636e72; text-transform: uppercase; }
    .filter-group select {
      padding: 10px 14px;
      border: 2px solid #eee;
      border-radius: 10px;
      font-size: 14px;
      min-width: 140px;
    }
    .legend { display: flex; gap: 20px; margin-left: auto; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #636e72; }
    .dot { width: 12px; height: 12px; border-radius: 4px; }
    .dot.available { background: #00b894; }
    .dot.occupied { background: #e74c3c; }
    .dot.maintenance { background: #95a5a6; }
    .map-container {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
      overflow: auto;
    }
    .map-svg { width: 100%; height: 500px; }
    .space-rect { cursor: pointer; transition: all 0.2s; stroke: white; stroke-width: 2; }
    .space-rect:hover { transform: scale(1.05); transform-origin: center; }
    .space-rect.available { fill: #00b894; }
    .space-rect.occupied { fill: #e74c3c; }
    .space-rect.maintenance { fill: #95a5a6; }
    .space-label { font-size: 10px; fill: white; text-anchor: middle; dominant-baseline: middle; pointer-events: none; font-weight: 600; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white; border-radius: 20px; width: 90%; max-width: 480px;
      animation: modalSlide 0.3s ease;
    }
    @keyframes modalSlide {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 24px; border-bottom: 1px solid #eee;
    }
    .modal-header h2 { margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: #1a1a2e; }
    .close-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 8px; }
    .close-btn:hover { background: #f5f5f5; }
    .modal-body { padding: 24px; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
    .info-row .label { color: #636e72; font-size: 14px; }
    .info-row .value { font-weight: 600; color: #1a1a2e; font-size: 14px; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-available { background: #dcfce7; color: #166534; }
    .status-occupied { background: #fee2e2; color: #991b1b; }
    .status-maintenance { background: #f1f5f9; color: #475569; }
    .contract-info { margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee; }
    .contract-info h3 { font-size: 14px; color: #1a1a2e; margin-bottom: 12px; }
    .no-contract { display: flex; align-items: center; gap: 8px; margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 12px; color: #636e72; }
    .no-contract .material-icons { font-size: 20px; }
  `]
})
export class MallMapComponent implements OnInit {
  spaces: MapSpace[] = [];
  filteredSpaces: MapSpace[] = [];
  floors: number[] = [1, 2, 3];
  selectedFloor = 1;
  typeFilter = '';
  statusFilter = '';
  selectedSpace: SpaceDetails | null = null;

  constructor(private mallMapService: MallMapService) {}

  ngOnInit() {
    this.loadFloors();
    this.loadMap();
  }

  loadFloors() {
    this.mallMapService.getFloors().subscribe({
      next: (floors: number[]) => {
        if (floors.length > 0) {
          this.floors = floors;
        }
      },
      error: () => {}
    });
  }

  loadMap() {
    this.mallMapService.getMapData(this.selectedFloor).subscribe({
      next: (data: MapSpace[]) => {
        this.spaces = data;
        this.applyFilters();
      },
      error: (err: any) => console.error('Error loading map', err)
    });
  }

  applyFilters() {
    this.filteredSpaces = this.spaces.filter(space => {
      const matchesType = !this.typeFilter || space.type === this.typeFilter;
      const matchesStatus = !this.statusFilter || space.status === this.statusFilter;
      return matchesType && matchesStatus;
    });
  }

  openSpaceDetails(space: MapSpace) {
    this.mallMapService.getSpaceDetails(space.id).subscribe({
      next: (details: SpaceDetails) => this.selectedSpace = details,
      error: (err: any) => console.error('Error loading space details', err)
    });
  }

  closeModal() {
    this.selectedSpace = null;
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'box': return 'Box';
      case 'kiosque': return 'Kiosque';
      case 'stand': return 'Stand';
      default: return type;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupé';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  }
}
