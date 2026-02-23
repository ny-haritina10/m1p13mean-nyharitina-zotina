import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueService, Boutique } from '../../services/boutique.service';

interface LocationInfo {
  spaceNumber: string;
  contractInfo?: {
    startDate: string;
    endDate: string;
    monthlyRent: number;
  };
}

@Component({
  selector: 'app-boutique-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="boutique-container">
      <div class="page-header">
        <h1>🏪 Ma Boutique</h1>
        <p>Consultez et gérez les informations de votre boutique</p>
      </div>

      <!-- Location Info (Always visible) -->
      <div *ngIf="location" class="location-card">
        <h2>📍 Localisation dans le centre</h2>
        <div class="location-info">
          <div class="info-item">
            <span class="info-label">Numéro Box :</span>
            <span class="info-value">{{ location.spaceNumber }}</span>
          </div>
        </div>
        <p class="location-note">Cette information est gérée par l'administration du centre commercial.</p>
      </div>

      <!-- Display Mode -->
      <div *ngIf="!isEditing" class="boutique-card">
        <div class="card-header">
          <div class="boutique-logo">
            <img *ngIf="boutique.logo" [src]="boutique.logo" alt="Logo boutique" class="logo-image" />
            <span *ngIf="!boutique.logo" class="logo-placeholder">
              <span class="material-icons">storefront</span>
            </span>
          </div>
          <div class="boutique-info">
            <h2>{{ boutique.name || '' }}</h2>
            <p *ngIf="boutique.description" class="boutique-description">{{ boutique.description }}</p>
          </div>
        </div>

        <div class="card-content" *ngIf="boutique.name">
          <div class="info-section">
            <h3>📞 Coordonnées</h3>
            <div class="info-grid">
              <div class="info-row">
                <span class="material-icons info-icon">phone</span>
                <span class="info-value">{{ boutique.phone || 'Non renseigné' }}</span>
              </div>
              <div class="info-row">
                <span class="material-icons info-icon">email</span>
                <span class="info-value">{{ boutique.email || 'Non renseigné' }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>🕐 Horaires d'Ouverture</h3>
            <div class="hours-display">
              <div class="hour-item">
                <span class="hour-label">Ouverture :</span>
                <span class="hour-value">{{ getOpenTime() }}</span>
              </div>
              <div class="hour-item">
                <span class="hour-label">Fermeture :</span>
                <span class="hour-value">{{ getCloseTime() }}</span>
              </div>
            </div>
            <p class="hours-note">Valable tous les jours de la semaine</p>
          </div>
        </div>

        <div *ngIf="!boutique.name" class="empty-state">
          <span class="material-icons">storefront</span>
          <p>Aucune information de boutique enregistrée</p>
        </div>

        <div class="card-actions">
          <button (click)="enableEdit()" class="btn-primary">
            <span class="material-icons">edit</span>
            {{ boutique.name ? 'Modifier' : 'Créer ma boutique' }}
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <form *ngIf="isEditing" (ngSubmit)="onSubmit()" class="boutique-form">
        <div class="form-section">
          <h2>Logo de la boutique</h2>
          <div class="logo-upload">
            <div class="logo-preview">
              <img *ngIf="logoPreview" [src]="logoPreview" alt="Logo" class="preview-image" />
              <span *ngIf="!logoPreview" class="logo-placeholder">
                <span class="material-icons">storefront</span>
              </span>
            </div>
            <div class="upload-controls">
              <input
                type="file"
                id="logo-upload"
                (change)="onFileSelected($event)"
                accept="image/*"
                hidden
              />
              <label for="logo-upload" class="btn-upload">
                <span class="material-icons">upload_file</span>
                Choisir une image
              </label>
              <button *ngIf="boutique.logo || selectedFile" type="button" (click)="removeLogo()" class="btn-remove">
                <span class="material-icons">delete</span>
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Informations Générales</h2>

          <div class="form-group">
            <label>Nom de la boutique *</label>
            <input
              type="text"
              [(ngModel)]="boutique.name"
              name="name"
              required
              placeholder="Ex: Mode & Style"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              [(ngModel)]="boutique.description"
              name="description"
              rows="4"
              placeholder="Décrivez votre boutique..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                [(ngModel)]="boutique.phone"
                name="phone"
                placeholder="+261 ..."
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="boutique.email"
                name="email"
                placeholder="boutique@example.com"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Horaires d'Ouverture</h2>
          <p class="section-note">Ces horaires s'appliquent à tous les jours de la semaine</p>

          <div class="hours-inputs">
            <div class="form-group">
              <label>Heure d'ouverture *</label>
              <input
                type="time"
                [(ngModel)]="openingTime"
                name="openingTime"
                class="time-input-large"
              />
            </div>

            <div class="form-group">
              <label>Heure de fermeture *</label>
              <input
                type="time"
                [(ngModel)]="closingTime"
                name="closingTime"
                class="time-input-large"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="cancelEdit()" class="btn-cancel">
            <span class="material-icons">close</span>
            Annuler
          </button>
          <button type="submit" class="btn-save" [disabled]="isLoading">
            <span *ngIf="!isLoading">💾 Enregistrer</span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
        </div>
      </form>

      <div *ngIf="message" class="message" [class.error]="isError">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .boutique-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #636e72;
      font-size: 14px;
    }

    .location-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      color: white;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .location-card h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .location-info {
      display: flex;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 12px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 24px;
      font-weight: 700;
    }

    .location-note {
      margin-top: 16px;
      font-size: 13px;
      opacity: 0.7;
      font-style: italic;
    }

    .boutique-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #f0f0f0;
    }

    .boutique-logo {
      width: 120px;
      height: 120px;
      background: #faf9f6;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      border: 2px solid #e0e0e0;
    }

    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .logo-placeholder {
      font-size: 48px;
      color: #b2bec3;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .boutique-info {
      flex: 1;
    }

    .boutique-info h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }

    .boutique-description {
      color: #636e72;
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-section {
      background: #faf9f6;
      border-radius: 12px;
      padding: 20px;
    }

    .info-section h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 16px;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-icon {
      color: #e94560;
      font-size: 20px;
    }

    .info-value {
      color: #1a1a2e;
      font-size: 15px;
    }

    .hours-display {
      display: flex;
      gap: 32px;
    }

    .hour-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .hour-label {
      font-size: 13px;
      color: #636e72;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .hour-value {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .hours-note {
      margin-top: 12px;
      font-size: 13px;
      color: #636e72;
      font-style: italic;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-state .material-icons {
      font-size: 64px;
      color: #b2bec3;
      margin-bottom: 16px;
    }

    .empty-state p {
      color: #636e72;
      font-size: 16px;
      margin-bottom: 24px;
    }

    .card-actions {
      display: flex;
      justify-content: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 2px solid #f0f0f0;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #d63651;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(233, 69, 96, 0.3);
    }

    .btn-primary .material-icons {
      font-size: 20px;
    }

    .boutique-form {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .form-section {
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-section h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 20px;
    }

    .section-note {
      color: #636e72;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .logo-upload {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .logo-preview {
      width: 120px;
      height: 120px;
      background: #faf9f6;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 2px solid #e0e0e0;
      flex-shrink: 0;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .upload-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-upload {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-upload:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }

    .btn-remove {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-remove:hover {
      background: #ffcdd2;
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

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #e94560;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .hours-inputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .time-input-large {
      width: 100%;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 18px;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.3s;
    }

    .time-input-large:focus {
      outline: none;
      border-color: #e94560;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-cancel {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      background: #f0f0f0;
      color: #636e72;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .btn-save {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-save:hover:not(:disabled) {
      background: #d63651;
      transform: translateY(-2px);
    }

    .btn-save:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      margin-top: 20px;
      padding: 14px 18px;
      border-radius: 10px;
      font-size: 14px;
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }

    .message.error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
  `]
})
export class BoutiqueFormComponent implements OnInit {
  boutique: Boutique = {
    name: '',
    description: '',
    logo: '',
    phone: '',
    email: '',
    location: {
      floor: 0,
      zone: '',
      spaceNumber: ''
    },
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00' }
    }
  };

  location: LocationInfo | null = null;
  isEditing = false;
  isLoading = false;
  message = '';
  isError = false;
  selectedFile: File | null = null;
  logoPreview: string | null = null;
  openingTime = '09:00';
  closingTime = '18:00';

  constructor(private boutiqueService: BoutiqueService) {}

  ngOnInit(): void {
    this.loadBoutique();
  }

  loadBoutique(): void {
    this.boutiqueService.getBoutique().subscribe({
      next: (response) => {
        if (response.boutique) {
          this.boutique = response.boutique;
          // Set opening/closing times from monday (same for all days)
          this.openingTime = this.boutique.openingHours?.['monday']?.open || '09:00';
          this.closingTime = this.boutique.openingHours?.['monday']?.close || '18:00';
        }
        if (response.location) {
          this.location = {
            spaceNumber: response.location.spaceNumber
          };
        }
        this.logoPreview = this.boutique.logo || null;
      },
      error: () => {
        // Boutique doesn't exist yet
      }
    });
  }

  getOpenTime(): string {
    return this.boutique.openingHours?.['monday']?.open || '09:00';
  }

  getCloseTime(): string {
    return this.boutique.openingHours?.['monday']?.close || '18:00';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeLogo(): void {
    this.selectedFile = null;
    this.logoPreview = null;
    this.boutique.logo = '';
  }

  enableEdit(): void {
    this.isEditing = true;
    this.openingTime = this.getOpenTime();
    this.closingTime = this.getCloseTime();
    this.logoPreview = this.boutique.logo || null;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedFile = null;
    this.logoPreview = null;
    this.message = '';
    this.isError = false;
    this.loadBoutique();
  }

  onSubmit(): void {
    this.isLoading = true;
    this.message = '';
    this.isError = false;

    console.log('Submitting boutique:', this.boutique);

    // Apply same hours to all days
    const hoursData = {
      open: this.openingTime,
      close: this.closingTime
    };

    this.boutique.openingHours = {
      monday: hoursData,
      tuesday: hoursData,
      wednesday: hoursData,
      thursday: hoursData,
      friday: hoursData,
      saturday: hoursData,
      sunday: hoursData
    };

    // Handle logo upload (for now, just store as base64)
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.boutique.logo = e.target.result;
        console.log('Logo loaded, size:', this.boutique.logo.length);
        this.saveBoutique();
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.saveBoutique();
      };
      reader.readAsDataURL(this.selectedFile);
    } else if (this.logoPreview === null) {
      this.boutique.logo = '';
      this.saveBoutique();
    } else {
      this.saveBoutique();
    }
  }

  saveBoutique(): void {
    this.boutiqueService.saveBoutique(this.boutique).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEditing = false;
        this.selectedFile = null;
        this.logoPreview = null;
        this.message = '✅ Boutique enregistrée avec succès!';
        // Force reload after save
        setTimeout(() => {
          this.loadBoutique();
        }, 100);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.error?.error || 'Erreur lors de l\'enregistrement';
      }
    });
  }
}
