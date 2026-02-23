import { Routes } from '@angular/router';
import { SellerLayoutComponent } from './layout/layout.component';
import { BoutiqueFormComponent } from './components/boutique-form/boutique-form.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { sellerGuard } from '../auth/guards/seller.guard';

export const SELLER_ROUTES: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    canActivate: [AuthGuard, sellerGuard],
    children: [
      { path: '', redirectTo: 'boutique', pathMatch: 'full' },
      { path: 'boutique', component: BoutiqueFormComponent }
    ]
  }
];
