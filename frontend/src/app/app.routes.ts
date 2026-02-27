import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CustomerLoginComponent } from './auth/components/customer-login/customer-login.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { SellerListComponent } from './admin/components/seller-list/seller-list.component';
import { ContractListComponent } from './admin/pages/contracts/contract-list/contract-list.component';
import { CreateContractComponent } from './admin/pages/contracts/create-contract/create-contract.component';
import { SpaceListComponent } from './admin/pages/spaces/space-list/space-list.component';
import { CreateSpaceComponent } from './admin/pages/spaces/create-space/create-space.component';
import { RentListComponent } from './admin/pages/rents/rent-list/rent-list.component';
import { GenerateRentComponent } from './admin/pages/rents/generate-rent/generate-rent.component';
import { FinancialDashboardComponent } from './admin/pages/reports/dashboard/financial-dashboard.component';
import { MonthlyReportComponent } from './admin/pages/reports/monthly/monthly-report.component';
import { YearlyReportComponent } from './admin/pages/reports/yearly/yearly-report.component';
import { MallMapComponent } from './admin/pages/mall-map/mall-map.component';
import { SpaceAvailabilityComponent } from './admin/pages/availability/space-availability.component';
import { AssignSpaceComponent } from './admin/pages/assign-space/assign-space.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { sellerGuard } from './auth/guards/seller.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'customer-login', component: CustomerLoginComponent },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },
  {
    path: 'products',
    loadComponent: () => import('./customer/pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: '',
    loadComponent: () => import('./customer/pages/home/home.component').then(m => m.CustomerHomeComponent)
  },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'home', component: AdminHomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'sellers', component: SellerListComponent },
      { path: 'contracts', component: ContractListComponent },
      { path: 'contracts/create', component: CreateContractComponent },
      { path: 'spaces', component: SpaceListComponent },
      { path: 'spaces/create', component: CreateSpaceComponent },
      { path: 'rents', component: RentListComponent },
      { path: 'rents/generate', component: GenerateRentComponent },
      { path: 'reports/dashboard', component: FinancialDashboardComponent },
      { path: 'reports/monthly', component: MonthlyReportComponent },
      { path: 'reports/yearly', component: YearlyReportComponent },
      { path: 'map', component: MallMapComponent },
      { path: 'availability', component: SpaceAvailabilityComponent },
      { path: 'spaces/assign', component: AssignSpaceComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'seller',
    loadChildren: () => import('./seller/seller.routes').then(m => m.SELLER_ROUTES),
    canActivate: [AuthGuard, sellerGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
