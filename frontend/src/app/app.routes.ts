import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin/home', 
    component: AdminHomeComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
