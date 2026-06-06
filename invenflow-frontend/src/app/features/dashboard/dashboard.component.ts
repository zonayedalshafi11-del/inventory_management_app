import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';
import { StockService } from '../stock/stock.service';
import { StockSummary } from '../../shared/models/stock.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatChipsModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly stockService = inject(StockService);

  protected readonly productCount = signal(0);
  protected readonly purchaseOrderCount = signal(0);
  protected readonly salesOrderCount = signal(0);
  protected readonly lowStockItems = signal<StockSummary[]>([]);
  protected readonly loading = signal(true);

  protected readonly displayedColumns = ['name', 'currentStock', 'reorderLevel', 'stockStatus'];

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getAll(),
      purchaseOrders: this.orderService.getPurchaseOrders(),
      salesOrders: this.orderService.getSalesOrders(),
      stock: this.stockService.getSummary(),
    }).subscribe({
      next: ({ products, purchaseOrders, salesOrders, stock }) => {
        this.productCount.set(products.length);
        this.purchaseOrderCount.set(purchaseOrders.length);
        this.salesOrderCount.set(salesOrders.length);
        this.lowStockItems.set(
          stock.filter((s) => s.stockStatus === 'Low Stock' || s.stockStatus === 'Out of Stock'),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
