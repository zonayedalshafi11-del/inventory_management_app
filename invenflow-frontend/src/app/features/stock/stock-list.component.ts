import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { StockSummary, StockTransaction } from '../../shared/models/stock.model';
import { StockService } from './stock.service';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule, MatTabsModule],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss',
})
export class StockListComponent implements OnInit {
  private readonly stockService = inject(StockService);

  protected readonly summary = signal<StockSummary[]>([]);
  protected readonly transactions = signal<StockTransaction[]>([]);
  protected readonly filteredSummary = signal<StockSummary[]>([]);
  protected readonly filteredTransactions = signal<StockTransaction[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly summaryColumns = [
    'name',
    'sku',
    'category',
    'currentStock',
    'reorderLevel',
    'supplier',
    'stockStatus',
  ];

  protected readonly transactionColumns = [
    'type',
    'productName',
    'quantity',
    'reference',
    'counterparty',
    'date',
  ];

  ngOnInit(): void {
    this.loadData();
  }

  protected loadData(): void {
    this.loading.set(true);
    this.stockService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.applyFilter();
      },
      error: () => this.loading.set(false),
    });
    this.stockService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
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
      this.filteredSummary.set(this.summary());
      this.filteredTransactions.set(this.transactions());
      return;
    }
    this.filteredSummary.set(
      this.summary().filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.sku.toLowerCase().includes(term) ||
          s.category.toLowerCase().includes(term) ||
          s.supplier.toLowerCase().includes(term) ||
          s.stockStatus.toLowerCase().includes(term),
      ),
    );
    this.filteredTransactions.set(
      this.transactions().filter(
        (t) =>
          t.productName.toLowerCase().includes(term) ||
          t.reference.toLowerCase().includes(term) ||
          t.counterparty.toLowerCase().includes(term) ||
          t.type.toLowerCase().includes(term),
      ),
    );
  }
}
