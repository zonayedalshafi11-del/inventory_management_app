import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Customer[]> {
    return this.api.get<Customer[]>('/customers');
  }

  create(customer: Customer): Observable<Customer> {
    return this.api.post<Customer>('/customers', customer);
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.api.put<Customer>(`/customers/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/customers/${id}`);
  }
}
