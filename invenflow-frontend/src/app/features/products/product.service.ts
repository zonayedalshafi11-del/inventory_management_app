import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>('/products');
  }

  create(product: Product): Observable<Product> {
    return this.api.post<Product>('/products', product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/products/${id}`);
  }
}
