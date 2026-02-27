import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.CustomerHomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/order-history/order-history.component').then(m => m.OrderHistoryComponent)
  },
  {
    path: 'orders/:orderId',
    loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  }
];
