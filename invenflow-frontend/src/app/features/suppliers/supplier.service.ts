import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Supplier } from '../../shared/models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Supplier[]> {
    return this.api.get<Supplier[]>('/suppliers');
  }

  create(supplier: Supplier): Observable<Supplier> {
    return this.api.post<Supplier>('/suppliers', supplier);
  }

  update(id: number, supplier: Supplier): Observable<Supplier> {
    return this.api.put<Supplier>(`/suppliers/${id}`, supplier);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/suppliers/${id}`);
  }
}
