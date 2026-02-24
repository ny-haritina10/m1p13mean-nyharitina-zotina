import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { ProductService, Product } from '../../services/product.service';

interface SaleProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  name: string;
  stock: number;
}

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-container">
      <div class="page-header">
        <div>
          <h1>🛒 Nouvelle Vente</h1>
          <p>Enregistrez une vente manuelle</p>
        </div>
        <button type="button" (click)="cancel()" class="btn-cancel">
          <span class="material-icons">close</span>
          Annuler
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="sale-form">
        <!-- Products Section -->
        <div class="form-section">
          <h2>📦 Produits</h2>
          
          <div class="product-selector">
            <div class="form-group">
              <label>Produit *</label>
              <select [(ngModel)]="selectedProductId" name="selectedProduct" (change)="onProductSelect()">
                <option value="">Sélectionner un produit</option>
                <option *ngFor="let p of products" [value]="p._id">
                  {{ p.name }} - {{ p.price | number:'1.0-0' }} Ar (Stock: {{ p.stock }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Quantité *</label>
              <input
                type="number"
                [(ngModel)]="newProductQuantity"
                name="quantity"
                min="1"
                [max]="selectedProductMax"
                placeholder="1"
              />
            </div>

            <div class="form-group">
              <label>Prix unitaire (Ar) *</label>
              <input
                type="number"
                [(ngModel)]="newProductPrice"
                name="unitPrice"
                min="0"
                placeholder="50000"
              />
            </div>

            <button type="button" (click)="addProduct()" class="btn-add" [disabled]="!selectedProductId">
              <span class="material-icons">add</span>
              Ajouter
            </button>
          </div>

          <!-- Selected Products Table -->
          <div class="products-table" *ngIf="saleProducts.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix</th>
                  <th>Sous-total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of saleProducts">
                  <td>{{ p.name }}</td>
                  <td>{{ p.quantity }}</td>
                  <td>{{ p.unitPrice | number:'1.0-0' }} Ar</td>
                  <td>{{ p.subtotal | number:'1.0-0' }} Ar</td>
                  <td>
                    <button type="button" (click)="removeProduct(p.productId)" class="btn-icon delete">
                      <span class="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Section -->
        <div class="form-section">
          <h2>💰 Paiement</h2>

          <div class="form-row">
            <div class="form-group">
              <label>Méthode de paiement *</label>
              <select [(ngModel)]="sale.paymentMethod" name="paymentMethod" required>
                <option value="">Sélectionner</option>
                <option value="cash">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Carte</option>
                <option value="mixed">Mixte</option>
              </select>
            </div>

            <div class="form-group">
              <label>Statut paiement *</label>
              <select [(ngModel)]="sale.paymentStatus" name="paymentStatus" required>
                <option value="paid">Payé</option>
                <option value="pending">En attente</option>
                <option value="partial">Partiel</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Remise (%)</label>
              <input
                type="number"
                [(ngModel)]="sale.discount"
                name="discount"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>

            <div class="form-group">
              <label>Montant payé (Ar)</label>
              <input
                type="number"
                [(ngModel)]="sale.amountPaid"
                name="amountPaid"
                min="0"
                [placeholder]="totalAmount.toString()"
              />
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="form-section">
          <h2>👤 Client (Optionnel)</h2>

          <div class="form-row">
            <div class="form-group">
              <label>Nom</label>
              <input
                type="text"
                [(ngModel)]="customerName"
                name="customerName"
                placeholder="Nom du client"
              />
            </div>

            <div class="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                [(ngModel)]="customerPhone"
                name="customerPhone"
                placeholder="+261 ..."
              />
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-section">
          <h2>📝 Description / Notes</h2>
          <div class="form-group">
            <label>Description de la vente</label>
            <textarea
              [(ngModel)]="sale.notes"
              name="notes"
              rows="4"
              placeholder="Détails de la vente, informations complémentaires..."
            ></textarea>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-row">
            <span>Sous-total:</span>
            <span>{{ productsTotal | number:'1.0-0' }} Ar</span>
          </div>
          <div class="summary-row" *ngIf="sale.discount > 0">
            <span>Remise ({{ sale.discount }}%):</span>
            <span class="discount">- {{ discountAmount | number:'1.0-0' }} Ar</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ totalAmount | number:'1.0-0' }} Ar</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" (click)="cancel()" class="btn-cancel-large">
            <span class="material-icons">close</span>
            Annuler
          </button>
          <button type="submit" class="btn-save" [disabled]="!isValid()">
            <span *ngIf="!isLoading">
              ✅ Enregistrer la vente
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

    .sale-form {
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

    .product-selector {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
      margin-bottom: 24px;
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
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #e94560;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      height: 52px;
    }

    .btn-add:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-add:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .products-table {
      margin-top: 20px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      background: #faf9f6;
      padding: 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #636e72;
    }

    .table td {
      padding: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border: none;
      background: #faf9f6;
      color: #636e72;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon.delete:hover {
      background: #e74c3c;
      color: white;
    }

    .summary-section {
      background: #faf9f6;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }

    .summary-row.total {
      border-top: 2px solid #e0e0e0;
      margin-top: 8px;
      padding-top: 16px;
      font-size: 18px;
      font-weight: 700;
    }

    .summary-row .discount {
      color: #e74c3c;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
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
    }

    .btn-save:hover:not(:disabled) {
      background: #d63651;
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
export class SaleFormComponent implements OnInit {
  products: Product[] = [];
  saleProducts: SaleProduct[] = [];
  
  selectedProductId = '';
  selectedProductMax = 0;
  newProductQuantity = 1;
  newProductPrice = 0;

  sale: any = {
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    discount: 0,
    amountPaid: 0,
    notes: ''
  };

  customerName = '';
  customerPhone = '';

  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private saleService: SaleService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  onProductSelect(): void {
    const product = this.products.find(p => p._id === this.selectedProductId);
    if (product) {
      this.selectedProductMax = product.stock;
      this.newProductPrice = product.price;
      this.newProductQuantity = 1;
    }
  }

  addProduct(): void {
    if (!this.selectedProductId || this.newProductQuantity <= 0) {
      return;
    }

    const product = this.products.find(p => p._id === this.selectedProductId);
    if (!product) return;

    const existingProduct = this.saleProducts.find(p => p.productId === this.selectedProductId);
    if (existingProduct) {
      existingProduct.quantity += this.newProductQuantity;
      existingProduct.subtotal = existingProduct.quantity * existingProduct.unitPrice;
    } else {
      this.saleProducts.push({
        productId: this.selectedProductId,
        quantity: this.newProductQuantity,
        unitPrice: this.newProductPrice,
        subtotal: this.newProductQuantity * this.newProductPrice,
        name: product.name,
        stock: product.stock
      });
    }

    this.selectedProductId = '';
    this.newProductQuantity = 1;
    this.newProductPrice = 0;
  }

  removeProduct(productId: string): void {
    this.saleProducts = this.saleProducts.filter(p => p.productId !== productId);
  }

  get productsTotal(): number {
    return this.saleProducts.reduce((sum, p) => sum + p.subtotal, 0);
  }

  get discountAmount(): number {
    return (this.productsTotal * this.sale.discount) / 100;
  }

  get totalAmount(): number {
    return this.productsTotal - this.discountAmount;
  }

  isValid(): boolean {
    return this.saleProducts.length > 0 &&
           this.sale.paymentMethod &&
           this.sale.paymentStatus;
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.message = 'Veuillez ajouter au moins un produit';
      this.isError = true;
      console.error('❌ Validation failed: No products added');
      return;
    }

    this.isLoading = true;
    this.message = '';

    const saleData = {
      products: this.saleProducts.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        subtotal: p.subtotal
      })),
      paymentMethod: this.sale.paymentMethod,
      paymentStatus: this.sale.paymentStatus,
      amountPaid: this.sale.amountPaid || this.totalAmount,
      discount: this.sale.discount,
      notes: this.sale.notes,
      customerInfo: {
        name: this.customerName || undefined,
        phone: this.customerPhone || undefined
      }
    };

    console.log('🔍 Sending sale data:', saleData);

    this.saleService.createSale(saleData).subscribe({
      next: (response) => {
        console.log('✅ Sale created successfully:', response);
        this.isLoading = false;
        this.message = '✅ Vente enregistrée avec succès!';
        setTimeout(() => this.router.navigate(['/seller/sales']), 1500);
      },
      error: (err) => {
        console.error('❌ Error creating sale:', err);
        console.error('❌ Error details:', err.error);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        
        this.isLoading = false;
        this.isError = true;
        
        let errorMessage = 'Erreur lors de l\'enregistrement';
        
        if (err.error?.error) {
          errorMessage = err.error.error;
        } else if (err.status === 0) {
          errorMessage = 'Erreur de connexion au serveur';
        } else if (err.status === 400) {
          errorMessage = 'Données invalides';
        } else if (err.status === 404) {
          errorMessage = 'Produit non trouvé';
        } else if (err.status === 500) {
          errorMessage = 'Erreur serveur';
        }
        
        this.message = errorMessage;
        console.error('❌ Displaying error:', errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/seller/sales']);
  }
}
