import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Warehouse } from '../../shared/models/warehouse.model';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Warehouse[]> {
    return this.api.get<Warehouse[]>('/warehouses');
  }

  create(warehouse: Warehouse): Observable<Warehouse> {
    return this.api.post<Warehouse>('/warehouses', warehouse);
  }

  update(id: number, warehouse: Warehouse): Observable<Warehouse> {
    return this.api.put<Warehouse>(`/warehouses/${id}`, warehouse);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/warehouses/${id}`);
  }
}
