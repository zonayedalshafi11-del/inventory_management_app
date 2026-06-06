import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseOrder, PurchaseOrderItem } from '../../shared/models/order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-purchase-order-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    CurrencyPipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Purchase Order' : 'New Purchase Order' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Supplier</mat-label>
          <input matInput formControlName="supplier" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Order Date</mat-label>
          <input matInput type="date" formControlName="orderDate" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Expected Delivery</mat-label>
          <input matInput type="date" formControlName="expectedDelivery" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="RECEIVED">RECEIVED</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="items-section">
          <div class="items-header">
            <h3>Line Items</h3>
            <button mat-stroked-button type="button" (click)="addItem()">
              <mat-icon>add</mat-icon>
              Add Item
            </button>
          </div>
          <div formArrayName="items">
            @for (item of items.controls; track $index) {
              <div class="item-row" [formGroupName]="$index">
                <mat-form-field appearance="outline">
                  <mat-label>Product ID</mat-label>
                  <input matInput type="number" formControlName="productId" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Product Name</mat-label>
                  <input matInput formControlName="productName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Quantity</mat-label>
                  <input matInput type="number" formControlName="quantity" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Price</mat-label>
                  <input matInput type="number" formControlName="price" />
                </mat-form-field>
                <button
                  mat-icon-button
                  type="button"
                  aria-label="Remove item"
                  (click)="removeItem($index)"
                  [disabled]="items.length === 1"
                >
                  <mat-icon>remove_circle</mat-icon>
                </button>
              </div>
            }
          </div>
          <p class="total">Total: {{ computeTotal() | currency }}</p>
        </div>
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
      min-width: 640px;
    }
    mat-form-field {
      width: 100%;
    }
    .items-section {
      grid-column: 1 / -1;
    }
    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .items-header h3 {
      margin: 0;
    }
    .item-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr auto;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .total {
      text-align: right;
      font-weight: 600;
      margin: 0.5rem 0 0;
    }
  `,
})
export class PurchaseOrderFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly dialogRef = inject(MatDialogRef<PurchaseOrderFormDialogComponent>);
  protected readonly data = inject<PurchaseOrder | null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    supplier: [this.data?.supplier ?? '', Validators.required],
    orderDate: [this.data?.orderDate?.substring(0, 10) ?? ''],
    expectedDelivery: [this.data?.expectedDelivery?.substring(0, 10) ?? ''],
    status: [this.data?.status ?? 'Pending', Validators.required],
    items: this.fb.array(
      (this.data?.items?.length ? this.data.items : [this.emptyItem()]).map((item) =>
        this.createItemGroup(item),
      ),
    ),
  });

  protected get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private emptyItem(): PurchaseOrderItem {
    return { productId: 0, productName: '', quantity: 1, price: 0 };
  }

  private createItemGroup(item: PurchaseOrderItem) {
    return this.fb.nonNullable.group({
      productId: [item.productId, [Validators.required, Validators.min(1)]],
      productName: [item.productName, Validators.required],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]],
      price: [item.price, [Validators.required, Validators.min(0)]],
    });
  }

  protected addItem(): void {
    this.items.push(this.createItemGroup(this.emptyItem()));
  }

  protected removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  protected computeTotal(): number {
    return this.items.controls.reduce((sum, ctrl) => {
      const { quantity, price } = ctrl.getRawValue();
      return sum + quantity * price;
    }, 0);
  }

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload: PurchaseOrder = {
      supplier: raw.supplier,
      orderDate: raw.orderDate || undefined,
      expectedDelivery: raw.expectedDelivery || undefined,
      status: raw.status,
      totalAmount: this.computeTotal(),
      items: raw.items,
    };
    const request = this.data?.id
      ? this.orderService.updatePurchaseOrder(this.data.id, { ...payload, id: this.data.id })
      : this.orderService.createPurchaseOrder(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
