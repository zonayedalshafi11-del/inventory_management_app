import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Warehouse } from '../../shared/models/warehouse.model';
import { WarehouseService } from './warehouse.service';
import { WarehouseFormDialogComponent } from './warehouse-form-dialog.component';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss',
})
export class WarehouseListComponent implements OnInit {
  private readonly warehouseService = inject(WarehouseService);
  private readonly dialog = inject(MatDialog);

  protected readonly warehouses = signal<Warehouse[]>([]);
  protected readonly filteredWarehouses = signal<Warehouse[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = ['name', 'location', 'actions'];

  ngOnInit(): void {
    this.loadWarehouses();
  }

  protected loadWarehouses(): void {
    this.loading.set(true);
    this.warehouseService.getAll().subscribe({
      next: (data) => {
        this.warehouses.set(data);
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
      this.filteredWarehouses.set(this.warehouses());
      return;
    }
    this.filteredWarehouses.set(
      this.warehouses().filter(
        (w) =>
          w.name.toLowerCase().includes(term) ||
          w.location.toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(warehouse: Warehouse): void {
    this.openDialog(warehouse);
  }

  private openDialog(warehouse?: Warehouse): void {
    const ref = this.dialog.open(WarehouseFormDialogComponent, {
      width: '480px',
      data: warehouse ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadWarehouses();
      }
    });
  }

  protected deleteWarehouse(warehouse: Warehouse): void {
    if (!warehouse.id || !confirm(`Delete warehouse "${warehouse.name}"?`)) {
      return;
    }
    this.warehouseService.delete(warehouse.id).subscribe(() => this.loadWarehouses());
  }
}
