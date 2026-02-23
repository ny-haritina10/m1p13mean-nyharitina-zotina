import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
