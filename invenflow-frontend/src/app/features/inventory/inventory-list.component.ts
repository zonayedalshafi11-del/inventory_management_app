import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Inventory } from '../../shared/models/inventory.model';
import { InventoryService } from './inventory.service';
import { InventoryFormDialogComponent } from './inventory-form-dialog.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
})
export class InventoryListComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);
  private readonly dialog = inject(MatDialog);

  protected readonly inventory = signal<Inventory[]>([]);
  protected readonly filteredInventory = signal<Inventory[]>([]);
  protected readonly loading = signal(true);
  protected readonly searchTerm = signal('');

  protected readonly displayedColumns = [
    'productName',
    'warehouseName',
    'totalQuantity',
    'actions',
  ];

  ngOnInit(): void {
    this.loadInventory();
  }

  protected loadInventory(): void {
    this.loading.set(true);
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventory.set(data);
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
      this.filteredInventory.set(this.inventory());
      return;
    }
    this.filteredInventory.set(
      this.inventory().filter(
        (i) =>
          i.productName.toLowerCase().includes(term) ||
          i.warehouseName.toLowerCase().includes(term),
      ),
    );
  }

  protected openCreate(): void {
    this.openDialog();
  }

  protected openEdit(item: Inventory): void {
    this.openDialog(item);
  }

  private openDialog(item?: Inventory): void {
    const ref = this.dialog.open(InventoryFormDialogComponent, {
      width: '560px',
      data: item ?? null,
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadInventory();
      }
    });
  }

  protected deleteItem(item: Inventory): void {
    if (!item.id || !confirm(`Delete inventory record for "${item.productName}"?`)) {
      return;
    }
    this.inventoryService.delete(item.id).subscribe(() => this.loadInventory());
  }
}
