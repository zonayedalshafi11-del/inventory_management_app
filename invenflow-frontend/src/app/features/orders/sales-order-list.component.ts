import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SalesOrder } from '../../shared/models/order.model';
import { OrderService } from './order.service';
import { SalesOrderFormDialogComponent } from './sales-order-form-dialog.component';

@Component({
  selector: 'app-sales-order-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './sales-order-list.component.html',
  styleUrl: './sales-order-list.component.scss',
})
export class SalesOrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly dialog = inject(MatDialog);

  protected readonly orders = signal<SalesOrder[]>([]);
  protected readonly filteredOrders = signal<SalesOrder[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = [
    'customerName',
    'orderDate',
    'totalAmount',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  protected loadOrders(): void {
    this.loading.set(true);
    this.orderService.getSalesOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onSearch(term: string): void {
    this.searchTerm.set(term);
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      this.filteredOrders.set(this.orders());
      return;
    }
    this.filteredOrders.set(
      this.orders().filter(
        (o) =>
          o.customerName.toLowerCase().includes(term) ||
          o.status.toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(order: SalesOrder): void {
    this.openDialog(order);
  }

  private openDialog(order?: SalesOrder): void {
    const ref = this.dialog.open(SalesOrderFormDialogComponent, {
      width: '720px',
      data: order ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadOrders();
      }
    });
  }

  protected deleteOrder(order: SalesOrder): void {
    if (!order.id || !confirm(`Delete sales order for "${order.customerName}"?`)) {
      return;
    }
    this.orderService.deleteSalesOrder(order.id).subscribe(() => this.loadOrders());
  }
}
