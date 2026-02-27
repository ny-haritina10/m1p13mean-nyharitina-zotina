import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SellerOrderService } from '../../services/seller-order.service';
import { ProductService, Product } from '../../services/product.service';

interface OrderProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  name: string;
  stock: number;
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="form-container">
      <div class="page-header">
        <div>
          <h1>📦 Nouvelle Commande</h1>
          <p>Créez une commande pour un client</p>
        </div>
        <button type="button" (click)="cancel()" class="btn-cancel">
          <span class="material-icons">close</span>
          Annuler
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="order-form">
        <!-- Customer Info -->
        <div class="form-section">
          <h2>👤 Informations Client</h2>
          <div class="form-row">
            <div class="form-group">
              <label>Nom du client *</label>
              <input
                type="text"
                [(ngModel)]="order.customerName"
                name="customerName"
                required
                placeholder="Jean Dupont"
              />
            </div>

            <div class="form-group">
              <label>Téléphone *</label>
              <input
                type="tel"
                [(ngModel)]="order.customerPhone"
                name="customerPhone"
                required
                placeholder="+261 34 00 000 00"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="order.customerEmail"
              name="customerEmail"
              placeholder="client@example.com"
            />
          </div>
        </div>

        <!-- Products -->
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
          <div class="products-table" *ngIf="orderProducts.length > 0">
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
                <tr *ngFor="let p of orderProducts">
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
              <tfoot>
                <tr>
                  <td colspan="3" class="total-label">Total :</td>
                  <td colspan="2" class="total-amount">{{ productsTotal | number:'1.0-0' }} Ar</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="form-section">
          <h2>📍 Adresse de livraison</h2>
          <div class="form-group">
            <label>Rue</label>
            <input
              type="text"
              [(ngModel)]="order.deliveryStreet"
              name="deliveryStreet"
              placeholder="Rue Andriamanelo"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input
                type="text"
                [(ngModel)]="order.deliveryCity"
                name="deliveryCity"
                placeholder="Antananarivo"
              />
            </div>

            <div class="form-group">
              <label>Téléphone livraison</label>
              <input
                type="tel"
                [(ngModel)]="order.deliveryPhone"
                name="deliveryPhone"
                placeholder="+261 34 00 000 00"
              />
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div class="form-section">
          <h2>💰 Paiement</h2>
          <div class="form-row">
            <div class="form-group">
              <label>Méthode de paiement *</label>
              <select [(ngModel)]="order.paymentMethod" name="paymentMethod" required>
                <option value="">Sélectionner</option>
                <option value="cash">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Carte</option>
              </select>
            </div>

            <div class="form-group">
              <label>Statut paiement *</label>
              <select [(ngModel)]="order.paymentStatus" name="paymentStatus" required>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Customer Notes -->
        <div class="form-section">
          <div class="form-group">
            <label>Notes du client (optionnel)</label>
            <textarea
              [(ngModel)]="order.customerNotes"
              name="customerNotes"
              rows="3"
              placeholder="Instructions particulières..."
            ></textarea>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-section">
          <div class="summary-row total">
            <span>Montant Total :</span>
            <span>{{ productsTotal | number:'1.0-0' }} Ar</span>
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
              ✅ Créer la commande
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

    .order-form {
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

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
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

    .product-selector {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
      margin-bottom: 24px;
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

    .table tfoot td {
      background: #faf9f6;
      font-weight: 700;
    }

    .total-label {
      text-align: right;
    }

    .total-amount {
      color: #e94560;
      font-size: 18px;
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

    .summary-row.total {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 700;
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
export class OrderFormComponent implements OnInit {
  products: Product[] = [];
  orderProducts: OrderProduct[] = [];

  selectedProductId = '';
  selectedProductMax = 0;
  newProductQuantity = 1;
  newProductPrice = 0;

  order: any = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryStreet: '',
    deliveryCity: '',
    deliveryPhone: '',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    customerNotes: ''
  };

  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private orderService: SellerOrderService,
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

    const existingProduct = this.orderProducts.find(p => p.productId === this.selectedProductId);
    if (existingProduct) {
      existingProduct.quantity += this.newProductQuantity;
      existingProduct.subtotal = existingProduct.quantity * existingProduct.unitPrice;
    } else {
      this.orderProducts.push({
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
    this.orderProducts = this.orderProducts.filter(p => p.productId !== productId);
  }

  get productsTotal(): number {
    return this.orderProducts.reduce((sum, p) => sum + p.subtotal, 0);
  }

  isValid(): boolean {
    return this.orderProducts.length > 0 &&
           this.order.customerName &&
           this.order.customerPhone &&
           this.order.paymentMethod &&
           this.order.paymentStatus;
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.message = 'Veuillez remplir les champs obligatoires et ajouter au moins un produit';
      this.isError = true;
      console.error('❌ Validation failed');
      return;
    }

    this.isLoading = true;
    this.message = '';

    // Find customer (in real app, you'd have a customer selection)
    // For now, we'll create a placeholder
    const orderData = {
      customer: '699c9ec8e39df7c778bc0dbc', // Placeholder - should be selected from customers
      products: this.orderProducts.map(p => ({
        product: p.productId,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        subtotal: p.subtotal
      })),
      totalAmount: this.productsTotal,
      deliveryAddress: {
        street: this.order.deliveryStreet,
        city: this.order.deliveryCity,
        phone: this.order.deliveryPhone
      },
      paymentMethod: this.order.paymentMethod,
      paymentStatus: this.order.paymentStatus,
      customerNotes: this.order.customerNotes
    };

    console.log('🔍 Creating order:', orderData);

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('✅ Order created:', response);
        this.isLoading = false;
        this.message = '✅ Commande créée avec succès!';
        setTimeout(() => this.router.navigate(['/seller/orders']), 1500);
      },
      error: (err) => {
        console.error('❌ Error creating order:', err);
        console.error('❌ Error details:', err.error);
        
        this.isLoading = false;
        this.isError = true;
        
        let errorMessage = 'Erreur lors de la création';
        if (err.error?.error) {
          errorMessage = err.error.error;
        } else if (err.status === 0) {
          errorMessage = 'Erreur de connexion au serveur';
        }
        
        this.message = errorMessage;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/seller/orders']);
  }
}
