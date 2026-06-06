import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { PurchaseOrder, SalesOrder } from '../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);

  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.api.get<PurchaseOrder[]>('/orders/purchase');
  }

  createPurchaseOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.api.post<PurchaseOrder>('/orders/purchase', order);
  }

  updatePurchaseOrder(id: number, order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.api.put<PurchaseOrder>(`/orders/purchase/${id}`, order);
  }

  deletePurchaseOrder(id: number): Observable<void> {
    return this.api.delete(`/orders/purchase/${id}`);
  }

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.api.get<SalesOrder[]>('/orders/sales');
  }

  createSalesOrder(order: SalesOrder): Observable<SalesOrder> {
    return this.api.post<SalesOrder>('/orders/sales', order);
  }

  updateSalesOrder(id: number, order: SalesOrder): Observable<SalesOrder> {
    return this.api.put<SalesOrder>(`/orders/sales/${id}`, order);
  }

  deleteSalesOrder(id: number): Observable<void> {
    return this.api.delete(`/orders/sales/${id}`);
  }
}
