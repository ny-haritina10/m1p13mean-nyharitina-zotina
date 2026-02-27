import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.CustomerHomeComponent)
  }
];
