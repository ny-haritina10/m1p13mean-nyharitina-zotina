import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { SellerListComponent } from './admin/components/seller-list/seller-list.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: LayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'home', component: AdminHomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'sellers', component: SellerListComponent },
      { path: 'contracts', component: AdminHomeComponent },
      { path: 'spaces', component: AdminHomeComponent },
      { path: 'finances', component: AdminHomeComponent },
      { path: 'statistics', component: AdminHomeComponent },
      { path: 'settings', component: AdminHomeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
