import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../shared/models/product.model';
import { ProductService } from './product.service';
import { ProductFormDialogComponent } from './product-form-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);

  protected readonly products = signal<Product[]>([]);
  protected readonly filteredProducts = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = [
    'name',
    'sku',
    'category',
    'stock',
    'sellPrice',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
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
      this.filteredProducts.set(this.products());
      return;
    }
    this.filteredProducts.set(
      this.products().filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(product: Product): void {
    this.openDialog(product);
  }

  private openDialog(product?: Product): void {
    const ref = this.dialog.open(ProductFormDialogComponent, {
      width: '560px',
      data: product ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadProducts();
      }
    });
  }

  protected deleteProduct(product: Product): void {
    if (!product.id || !confirm(`Delete product "${product.name}"?`)) {
      return;
    }
    this.productService.delete(product.id).subscribe(() => this.loadProducts());
  }
}
