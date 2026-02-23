import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSpaceService, RentalSpace } from '../../../services/admin-space.service';

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Espaces Commerciaux</h1>
        <a routerLink="/admin/spaces/create" class="btn-primary">
          <span class="material-icons">add</span>
          Nouvel Espace
        </a>
      </div>

      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="loadSpaces()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="occupied">Occupé</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select [(ngModel)]="typeFilter" (change)="loadSpaces()" class="filter-select">
          <option value="">Tous les types</option>
          <option value="box">Box</option>
          <option value="kiosque">Kiosque</option>
          <option value="stand">Stand</option>
        </select>
        <select [(ngModel)]="floorFilter" (change)="loadSpaces()" class="filter-select">
          <option value="">Tous les étages</option>
          <option value="0">Rez-de-chaussée</option>
          <option value="1">Étage 1</option>
          <option value="2">Étage 2</option>
        </select>
      </div>

      <div class="table-container" *ngIf="spaces.length > 0; else noSpaces">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Étage</th>
              <th>Emplacement</th>
              <th>Surface</th>
              <th>Prix Mensuel</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let space of spaces">
              <td>{{ space.name }}</td>
              <td>{{ getTypeLabel(space.type) }}</td>
              <td>{{ space.floor ? 'Étage ' + space.floor : '-' }}</td>
              <td>{{ space.location || '-' }}</td>
              <td>{{ space.surface ? space.surface + ' m²' : '-' }}</td>
              <td>{{ space.monthlyPrice | number }} Ar</td>
              <td>
                <span class="status-badge" [class]="getStatusClass(space.status)">
                  {{ getStatusLabel(space.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noSpaces>
        <div class="empty-state">
          <span class="material-icons">meeting_room</span>
          <p>Aucun espace trouvé</p>
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
    .filters { 
      display: flex; 
      gap: 12px; 
      margin-bottom: 16px; 
    }
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
    .status-available { background: #dcfce7; color: #166534; }
    .status-occupied { background: #dbeafe; color: #1e40af; }
    .status-maintenance { background: #fef3c7; color: #92400e; }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #94a3b8;
    }
    .empty-state .material-icons { font-size: 48px; margin-bottom: 16px; }
  `]
})
export class SpaceListComponent implements OnInit {
  spaces: RentalSpace[] = [];
  statusFilter = '';
  typeFilter = '';
  floorFilter = '';

  constructor(private spaceService: AdminSpaceService) {}

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.spaceService.getSpaces(
      this.statusFilter || undefined, 
      this.typeFilter || undefined,
      this.floorFilter ? parseInt(this.floorFilter) : undefined
    ).subscribe({
      next: (data) => this.spaces = data,
      error: (err) => console.error('Error loading spaces', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available': return 'status-available';
      case 'occupied': return 'status-occupied';
      case 'maintenance': return 'status-maintenance';
      default: return '';
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

  getTypeLabel(type: string): string {
    switch (type) {
      case 'box': return 'Box';
      case 'kiosque': return 'Kiosque';
      case 'stand': return 'Stand';
      default: return type;
    }
  }
}
