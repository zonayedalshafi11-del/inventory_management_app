import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../features/auth/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  permission?: keyof import('../../shared/models/user.model').UserPermissions;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  protected readonly auth = inject(AuthService);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', permission: 'viewReports' },
    { label: 'Products', route: '/products', icon: 'inventory_2', permission: 'manageProducts' },
    { label: 'Stock', route: '/stock', icon: 'warehouse', permission: 'viewReports' },
    { label: 'Inventory', route: '/inventory', icon: 'shelves', permission: 'manageProducts' },
    { label: 'Warehouses', route: '/warehouses', icon: 'store', permission: 'manageProducts' },
    { label: 'Suppliers', route: '/suppliers', icon: 'local_shipping', permission: 'manageProducts' },
    { label: 'Customers', route: '/customers', icon: 'people', permission: 'manageOrders' },
    { label: 'Purchase Orders', route: '/orders/purchase', icon: 'shopping_cart', permission: 'manageOrders' },
    { label: 'Sales Orders', route: '/orders/sales', icon: 'point_of_sale', permission: 'manageOrders' },
    { label: 'Payments', route: '/payments', icon: 'payments', permission: 'manageOrders' },
    { label: 'Users', route: '/users', icon: 'admin_panel_settings', permission: 'manageUsers' },
  ];

  protected canShow(item: NavItem): boolean {
    if (!item.permission) {
      return true;
    }
    return this.auth.hasPermission(item.permission);
  }

  protected logout(): void {
    this.auth.logout();
  }
}
