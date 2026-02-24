import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product, Category } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-container">
      <div class="page-header">
        <div>
          <h1>{{ isEditMode ? '✏️ Modifier' : '➕ Nouveau' }} Produit</h1>
          <p>Remplissez les informations du produit</p>
        </div>
        <button type="button" (click)="cancel()" class="btn-cancel">
          <span class="material-icons">close</span>
          Annuler
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="product-form">
        <!-- Images Section -->
        <div class="form-section">
          <h2>📸 Images du produit</h2>
          <p class="section-note">Maximum 5 images (500KB max chacune)</p>
          
          <div class="image-upload-zone" 
               (dragover)="onDragOver($event)" 
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)">
            <input 
              type="file" 
              id="image-upload" 
              (change)="onFileSelected($event)" 
              accept="image/*"
              multiple
              hidden
            />
            
            <div *ngIf="!isDragging" class="upload-content">
              <span class="material-icons upload-icon">cloud_upload</span>
              <p>Glissez-déposez vos images ici</p>
              <p class="or-text">ou</p>
              <label for="image-upload" class="btn-select">
                <span class="material-icons">folder_open</span>
                Sélectionner des fichiers
              </label>
            </div>
            
            <div *ngIf="isDragging" class="drag-overlay">
              <span class="material-icons">file_download</span>
              <p>Déposez les images ici</p>
            </div>
          </div>

          <!-- Image Previews -->
          <div *ngIf="imagePreviews.length > 0" class="image-previews">
            <div *ngFor="let img of imagePreviews; let i = index" class="preview-item">
              <img [src]="img" alt="Preview" />
              <button type="button" (click)="removeImage(i)" class="remove-image">
                <span class="material-icons">close</span>
              </button>
              <span *ngIf="i === 0" class="main-badge">Principale</span>
            </div>
          </div>
        </div>

        <!-- Basic Info Section -->
        <div class="form-section">
          <h2>📋 Informations de base</h2>
          
          <div class="form-group">
            <label>Nom du produit *</label>
            <input 
              type="text" 
              [(ngModel)]="product.name" 
              name="name"
              required
              minlength="3"
              placeholder="Ex: Chemise Homme Coton"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              [(ngModel)]="product.description" 
              name="description"
              rows="4"
              placeholder="Décrivez votre produit..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Catégorie *</label>
              <select
                [(ngModel)]="product.category"
                name="category"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Prix (Ar) *</label>
              <input
                type="number"
                [(ngModel)]="product.price"
                name="price"
                required
                min="0"
                placeholder="50000"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Stock initial *</label>
              <input 
                type="number" 
                [(ngModel)]="product.stock" 
                name="stock"
                required
                min="0"
                placeholder="20"
              />
            </div>

            <div class="form-group">
              <label>Seuil d'alerte stock</label>
              <input 
                type="number" 
                [(ngModel)]="product.lowStockThreshold" 
                name="lowStockThreshold"
                min="0"
                placeholder="5"
              />
              <span class="field-note">Vous recevrez une alerte quand le stock sera ≤ à cette valeur</span>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" (click)="cancel()" class="btn-cancel-large">
            <span class="material-icons">close</span>
            Annuler
          </button>
          <button type="submit" class="btn-save" [disabled]="isLoading || !isValid()">
            <span *ngIf="!isLoading">
              {{ isEditMode ? '💾 Mettre à jour' : '✅ Créer le produit' }}
            </span>
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
    .form-container {
      max-width: 900px;
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

    .page-header p {
      color: #636e72;
      font-size: 14px;
    }

    .btn-cancel {
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
      transition: all 0.3s;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }

    .product-form {
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
      margin-bottom: 8px;
    }

    .section-note {
      color: #636e72;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .image-upload-zone {
      border: 2px dashed #e0e0e0;
      border-radius: 12px;
      padding: 48px 24px;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
      background: #faf9f6;
    }

    .image-upload-zone.dragging {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .upload-icon {
      font-size: 48px;
      color: #667eea;
    }

    .image-upload-zone p {
      color: #636e72;
      margin: 0;
    }

    .or-text {
      color: #b2bec3 !important;
      font-size: 12px !important;
    }

    .btn-select {
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

    .btn-select:hover {
      background: #5568d3;
    }

    .drag-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .drag-overlay .material-icons {
      font-size: 48px;
      color: #667eea;
    }

    .image-previews {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }

    .preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid #e0e0e0;
    }

    .preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .remove-image:hover {
      background: #e74c3c;
      transform: scale(1.1);
    }

    .main-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
      padding: 4px 10px;
      background: rgba(102, 126, 234, 0.9);
      color: white;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
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
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
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
      gap: 20px;
    }

    .field-note {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: #636e72;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    .btn-cancel-large {
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

    .btn-cancel-large:hover {
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
export class ProductFormComponent implements OnInit {
  product: Product = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    lowStockThreshold: 5,
    images: [],
    status: 'active'
  };

  categories: Category[] = [];
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isDragging = false;
  isEditMode = false;
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProduct(id);
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.imagePreviews = product.images || [];
      },
      error: () => {
        this.message = 'Erreur lors du chargement du produit';
        this.isError = true;
      }
    });
  }

  isValid(): boolean {
    return !!(this.product.name && this.product.name.length >= 3 && 
              this.product.category && 
              this.product.price > 0);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.handleFiles(files);
  }

  async handleFiles(files: File[]): Promise<void> {
    const remainingSlots = 5 - this.imagePreviews.length;
    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) continue;

      try {
        const compressedBlob = await this.productService.compressImage(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
          this.selectedFiles.push(file);
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.message = 'Veuillez remplir les champs obligatoires';
      this.isError = true;
      console.error('Validation failed:', {
        name: this.product.name,
        category: this.product.category,
        price: this.product.price
      });
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.isError = false;

    this.product.images = this.imagePreviews;

    console.log('🔍 Creating product:', {
      name: this.product.name,
      category: this.product.category,
      price: this.product.price,
      stock: this.product.stock,
      imagesCount: this.imagePreviews.length
    });

    if (this.isEditMode) {
      this.productService.updateProduct(this.product._id!, this.product).subscribe({
        next: (response) => {
          console.log('✅ Product updated:', response);
          this.isLoading = false;
          this.message = '✅ Produit mis à jour avec succès!';
          setTimeout(() => this.router.navigate(['/seller/products']), 1500);
        },
        error: (err) => {
          console.error('❌ Update error:', err);
          this.isLoading = false;
          this.isError = true;
          this.message = err.error?.error || 'Erreur lors de la mise à jour';
        }
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: (response) => {
          console.log('✅ Product created:', response);
          this.isLoading = false;
          this.message = '✅ Produit créé avec succès!';
          setTimeout(() => this.router.navigate(['/seller/products']), 1500);
        },
        error: (err) => {
          console.error('❌ Create error:', err);
          console.error('Error details:', err.error);
          this.isLoading = false;
          this.isError = true;
          this.message = err.error?.error || 'Erreur lors de la création';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/seller/products']);
  }
}
