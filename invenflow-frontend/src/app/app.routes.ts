import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        canActivate: [permissionGuard('viewReports')],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        canActivate: [permissionGuard('manageProducts')],
        loadComponent: () =>
          import('./features/products/product-list.component').then((m) => m.ProductListComponent),
      },
      {
        path: 'stock',
        canActivate: [permissionGuard('viewReports')],
        loadComponent: () =>
          import('./features/stock/stock-list.component').then((m) => m.StockListComponent),
      },
      {
        path: 'inventory',
        canActivate: [permissionGuard('manageProducts')],
        loadComponent: () =>
          import('./features/inventory/inventory-list.component').then((m) => m.InventoryListComponent),
      },
      {
        path: 'warehouses',
        canActivate: [permissionGuard('manageProducts')],
        loadComponent: () =>
          import('./features/warehouses/warehouse-list.component').then((m) => m.WarehouseListComponent),
      },
      {
        path: 'suppliers',
        canActivate: [permissionGuard('manageProducts')],
        loadComponent: () =>
          import('./features/suppliers/supplier-list.component').then((m) => m.SupplierListComponent),
      },
      {
        path: 'customers',
        canActivate: [permissionGuard('manageOrders')],
        loadComponent: () =>
          import('./features/customers/customer-list.component').then((m) => m.CustomerListComponent),
      },
      {
        path: 'orders/purchase',
        canActivate: [permissionGuard('manageOrders')],
        loadComponent: () =>
          import('./features/orders/purchase-order-list.component').then(
            (m) => m.PurchaseOrderListComponent,
          ),
      },
      {
        path: 'orders/sales',
        canActivate: [permissionGuard('manageOrders')],
        loadComponent: () =>
          import('./features/orders/sales-order-list.component').then((m) => m.SalesOrderListComponent),
      },
      {
        path: 'payments',
        canActivate: [permissionGuard('manageOrders')],
        loadComponent: () =>
          import('./features/payments/payment-list.component').then((m) => m.PaymentListComponent),
      },
      {
        path: 'users',
        canActivate: [permissionGuard('manageUsers')],
        loadComponent: () =>
          import('./features/users/user-list.component').then((m) => m.UserListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
