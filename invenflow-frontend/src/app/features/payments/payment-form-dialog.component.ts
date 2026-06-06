import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CreatePaymentRequest, PaymentMethod } from '../../shared/models/payment.model';
import { PaymentService } from './payment.service';

type OrderLinkType = 'PURCHASE' | 'SALES';

@Component({
  selector: 'app-payment-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>New Payment</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Method</mat-label>
          <mat-select formControlName="method" required>
            <mat-option value="CASH">CASH</mat-option>
            <mat-option value="CARD">CARD</mat-option>
            <mat-option value="TRANSFER">TRANSFER</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Order Type</mat-label>
          <mat-select formControlName="orderType" required>
            <mat-option value="PURCHASE">Purchase Order</mat-option>
            <mat-option value="SALES">Sales Order</mat-option>
          </mat-select>
        </mat-form-field>
        @if (form.controls.orderType.value === 'PURCHASE') {
          <mat-form-field appearance="outline">
            <mat-label>Purchase Order ID</mat-label>
            <input matInput type="number" formControlName="purchaseOrderId" required />
          </mat-form-field>
        }
        @if (form.controls.orderType.value === 'SALES') {
          <mat-form-field appearance="outline">
            <mat-label>Sales Order ID</mat-label>
            <input matInput type="number" formControlName="salesOrderId" required />
          </mat-form-field>
        }
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
      grid-template-columns: 1fr;
      gap: 0.75rem;
      min-width: 400px;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class PaymentFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly dialogRef = inject(MatDialogRef<PaymentFormDialogComponent>);
  protected readonly data = inject<null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    method: ['CASH' as PaymentMethod, Validators.required],
    orderType: ['PURCHASE' as OrderLinkType, Validators.required],
    purchaseOrderId: [0, [Validators.required, Validators.min(1)]],
    salesOrderId: [0],
  });

  ngOnInit(): void {
    this.form.controls.orderType.valueChanges.subscribe((type) => {
      if (type === 'PURCHASE') {
        this.form.controls.purchaseOrderId.setValidators([Validators.required, Validators.min(1)]);
        this.form.controls.salesOrderId.clearValidators();
        this.form.controls.salesOrderId.setValue(0);
      } else {
        this.form.controls.salesOrderId.setValidators([Validators.required, Validators.min(1)]);
        this.form.controls.purchaseOrderId.clearValidators();
        this.form.controls.purchaseOrderId.setValue(0);
      }
      this.form.controls.purchaseOrderId.updateValueAndValidity();
      this.form.controls.salesOrderId.updateValueAndValidity();
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload: CreatePaymentRequest = {
      amount: raw.amount,
      method: raw.method,
    };
    if (raw.orderType === 'PURCHASE') {
      payload.purchaseOrderId = raw.purchaseOrderId;
    } else {
      payload.salesOrderId = raw.salesOrderId;
    }

    this.paymentService.create(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
