import { Routes } from '@angular/router';
import { SellerLayoutComponent } from './layout/layout.component';
import { BoutiqueFormComponent } from './components/boutique-form/boutique-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { StockStatusComponent } from './components/stock-status/stock-status.component';
import { StockMovementComponent } from './components/stock-movement/stock-movement.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { sellerGuard } from '../auth/guards/seller.guard';

export const SELLER_ROUTES: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    canActivate: [AuthGuard, sellerGuard],
    children: [
      { path: '', redirectTo: 'boutique', pathMatch: 'full' },
      { path: 'boutique', component: BoutiqueFormComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'products/create', component: ProductFormComponent },
      { path: 'products/:id/edit', component: ProductFormComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'stock', component: StockStatusComponent },
      { path: 'stock/movements', component: StockMovementComponent },
      { path: 'stock/movements/create', component: StockMovementComponent }
    ]
  }
];
