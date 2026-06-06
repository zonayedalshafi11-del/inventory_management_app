import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Inventory } from '../../shared/models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Inventory[]> {
    return this.api.get<Inventory[]>('/inventory');
  }

  create(inventory: Inventory): Observable<Inventory> {
    return this.api.post<Inventory>('/inventory', inventory);
  }

  update(id: number, inventory: Inventory): Observable<Inventory> {
    return this.api.put<Inventory>(`/inventory/${id}`, inventory);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/inventory/${id}`);
  }
}
