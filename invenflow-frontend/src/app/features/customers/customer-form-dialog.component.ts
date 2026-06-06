import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '../../shared/models/customer.model';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Customer' : 'New Customer' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" required />
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
      grid-template-columns: 1fr;
      gap: 0.75rem;
      min-width: 400px;
    }
    mat-form-field {
      width: 100%;
    }
  `,
})
export class CustomerFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly dialogRef = inject(MatDialogRef<CustomerFormDialogComponent>);
  protected readonly data = inject<Customer | null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    email: [this.data?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.data?.phone ?? '', Validators.required],
  });

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const payload = this.form.getRawValue() as Customer;
    const request = this.data?.id
      ? this.customerService.update(this.data.id, { ...payload, id: this.data.id })
      : this.customerService.create(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
