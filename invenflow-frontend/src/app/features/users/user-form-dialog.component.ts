import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../shared/models/user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit User' : 'New User' }}</h2>
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
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" [required]="!data" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="ADMIN">Admin</mat-option>
            <mat-option value="MANAGER">Manager</mat-option>
            <mat-option value="STAFF">Staff</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="permissions">
          <mat-checkbox formControlName="manageProducts">Manage Products</mat-checkbox>
          <mat-checkbox formControlName="manageOrders">Manage Orders</mat-checkbox>
          <mat-checkbox formControlName="viewReports">View Reports</mat-checkbox>
          <mat-checkbox formControlName="manageUsers">Manage Users</mat-checkbox>
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
      min-width: 480px;
    }
    mat-form-field {
      width: 100%;
    }
    .permissions {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `,
})
export class UserFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  protected readonly data = inject<User | null>(MAT_DIALOG_DATA);

  protected saving = false;

  protected readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', Validators.required],
    email: [this.data?.email ?? '', [Validators.required, Validators.email]],
    password: [this.data?.password ?? '', this.data ? [] : [Validators.required, Validators.minLength(6)]],
    role: [this.data?.role ?? 'STAFF', Validators.required],
    status: [this.data?.status ?? 'Active'],
    manageProducts: [this.data?.manageProducts ?? false],
    manageOrders: [this.data?.manageOrders ?? false],
    viewReports: [this.data?.viewReports ?? false],
    manageUsers: [this.data?.manageUsers ?? false],
  });

  protected save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload: User = {
      name: raw.name,
      email: raw.email,
      role: raw.role,
      status: raw.status,
      manageProducts: raw.manageProducts,
      manageOrders: raw.manageOrders,
      viewReports: raw.viewReports,
      manageUsers: raw.manageUsers,
    };
    if (raw.password) {
      payload.password = raw.password;
    }
    const request = this.data?.id
      ? this.userService.update(this.data.id, { ...payload, id: this.data.id })
      : this.userService.create(payload);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.saving = false;
      },
    });
  }
}
