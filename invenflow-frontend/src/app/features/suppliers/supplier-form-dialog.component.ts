import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Supplier } from '../../shared/models/supplier.model';
import { SupplierService } from './supplier.service';

@Component({
  selector: 'app-supplier-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Supplier' : 'New Supplier' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contact Email</mat-label>
          <input matInput type="email" formControlName="contactEmail" required />
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
export class SupplierFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly supplierService = inject(SupplierService);
  private readonly dialogRef = inject(MatDialogRef<SupplierFormDialogComponent>);
  protected readonly data = inject<Supplier | null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    contactEmail: [this.data?.contactEmail ?? '', [Validators.required, Validators.email]],
    phone: [this.data?.phone ?? '', Validators.required],
  });

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const payload = this.form.getRawValue() as Supplier;
    const request = this.data?.id
      ? this.supplierService.update(this.data.id, { ...payload, id: this.data.id })
      : this.supplierService.create(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
