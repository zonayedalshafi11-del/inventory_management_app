import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Supplier } from '../../shared/models/supplier.model';
import { SupplierService } from './supplier.service';
import { SupplierFormDialogComponent } from './supplier-form-dialog.component';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss',
})
export class SupplierListComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly dialog = inject(MatDialog);

  protected readonly suppliers = signal<Supplier[]>([]);
  protected readonly filteredSuppliers = signal<Supplier[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = ['name', 'contactEmail', 'phone', 'actions'];

  ngOnInit(): void {
    this.loadSuppliers();
  }

  protected loadSuppliers(): void {
    this.loading.set(true);
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers.set(data);
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
      this.filteredSuppliers.set(this.suppliers());
      return;
    }
    this.filteredSuppliers.set(
      this.suppliers().filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.contactEmail.toLowerCase().includes(term) ||
          s.phone.toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(supplier: Supplier): void {
    this.openDialog(supplier);
  }

  private openDialog(supplier?: Supplier): void {
    const ref = this.dialog.open(SupplierFormDialogComponent, {
      width: '480px',
      data: supplier ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadSuppliers();
      }
    });
  }

  protected deleteSupplier(supplier: Supplier): void {
    if (!supplier.id || !confirm(`Delete supplier "${supplier.name}"?`)) {
      return;
    }
    this.supplierService.delete(supplier.id).subscribe(() => this.loadSuppliers());
  }
}
