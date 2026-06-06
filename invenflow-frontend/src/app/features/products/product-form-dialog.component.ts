import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../shared/models/product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Product' : 'New Product' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>SKU</mat-label>
          <input matInput formControlName="sku" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Supplier</mat-label>
          <input matInput formControlName="supplier" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cost Price</mat-label>
          <input matInput type="number" formControlName="costPrice" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Sell Price</mat-label>
          <input matInput type="number" formControlName="sellPrice" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Reorder Level</mat-label>
          <input matInput type="number" formControlName="reorderLevel" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <input matInput formControlName="status" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="form.invalid || saving">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      min-width: 480px;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class ProductFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  protected readonly data = inject<Product | null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    sku: [this.data?.sku ?? '', Validators.required],
    category: [this.data?.category ?? ''],
    supplier: [this.data?.supplier ?? ''],
    costPrice: [this.data?.costPrice ?? 0, Validators.min(0)],
    sellPrice: [this.data?.sellPrice ?? 0, Validators.min(0)],
    stock: [this.data?.stock ?? 0, Validators.min(0)],
    reorderLevel: [this.data?.reorderLevel ?? 0, Validators.min(0)],
    status: [this.data?.status ?? 'Active'],
  });

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const payload = this.form.getRawValue() as Product;
    const request = this.data?.id
      ? this.productService.update(this.data.id, { ...payload, id: this.data.id })
      : this.productService.create(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
