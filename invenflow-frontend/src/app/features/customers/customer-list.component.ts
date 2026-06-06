import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../shared/models/customer.model';
import { CustomerService } from './customer.service';
import { CustomerFormDialogComponent } from './customer-form-dialog.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly dialog = inject(MatDialog);

  protected readonly customers = signal<Customer[]>([]);
  protected readonly filteredCustomers = signal<Customer[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = ['name', 'email', 'phone', 'actions'];

  ngOnInit(): void {
    this.loadCustomers();
  }

  protected loadCustomers(): void {
    this.loading.set(true);
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
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
      this.filteredCustomers.set(this.customers());
      return;
    }
    this.filteredCustomers.set(
      this.customers().filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(customer: Customer): void {
    this.openDialog(customer);
  }

  private openDialog(customer?: Customer): void {
    const ref = this.dialog.open(CustomerFormDialogComponent, {
      width: '480px',
      data: customer ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadCustomers();
      }
    });
  }

  protected deleteCustomer(customer: Customer): void {
    if (!customer.id || !confirm(`Delete customer "${customer.name}"?`)) {
      return;
    }
    this.customerService.delete(customer.id).subscribe(() => this.loadCustomers());
  }
}
