import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Inventory } from '../../shared/models/inventory.model';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-inventory-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Inventory' : 'New Inventory' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Product ID</mat-label>
          <input matInput type="number" formControlName="productId" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="productName" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Warehouse ID</mat-label>
          <input matInput type="number" formControlName="warehouseId" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Warehouse Name</mat-label>
          <input matInput formControlName="warehouseName" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total Quantity</mat-label>
          <input matInput type="number" formControlName="totalQuantity" required />
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
export class InventoryFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryService);
  private readonly dialogRef = inject(MatDialogRef<InventoryFormDialogComponent>);
  protected readonly data = inject<Inventory | null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    productId: [this.data?.productId ?? 0, [Validators.required, Validators.min(1)]],
    productName: [this.data?.productName ?? '', Validators.required],
    warehouseId: [this.data?.warehouseId ?? 0, [Validators.required, Validators.min(1)]],
    warehouseName: [this.data?.warehouseName ?? '', Validators.required],
    totalQuantity: [this.data?.totalQuantity ?? 0, [Validators.required, Validators.min(0)]],
  });

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const payload = this.form.getRawValue() as Inventory;
    const request = this.data?.id
      ? this.inventoryService.update(this.data.id, { ...payload, id: this.data.id })
      : this.inventoryService.create(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
