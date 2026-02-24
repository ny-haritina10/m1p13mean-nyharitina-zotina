import { Routes } from '@angular/router';
import { SellerLayoutComponent } from './layout/layout.component';
import { BoutiqueFormComponent } from './components/boutique-form/boutique-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { StockStatusComponent } from './components/stock-status/stock-status.component';
import { StockMovementComponent } from './components/stock-movement/stock-movement.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './components/promotion-form/promotion-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
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
      { path: 'stock/movements/create', component: StockMovementComponent },
      { path: 'sales', component: SaleListComponent },
      { path: 'sales/create', component: SaleFormComponent },
      { path: 'sales/report', component: DailyReportComponent },
      { path: 'promotions', component: PromotionListComponent },
      { path: 'promotions/create', component: PromotionFormComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/create', component: OrderFormComponent },
      { path: 'orders/:id', component: OrderDetailComponent }
    ]
  }
];
