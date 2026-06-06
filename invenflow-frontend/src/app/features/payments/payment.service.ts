import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { CreatePaymentRequest, Payment } from '../../shared/models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Payment[]> {
    return this.api.get<Payment[]>('/payments');
  }

  getPurchasePayments(): Observable<Payment[]> {
    return this.api.get<Payment[]>('/payments/purchase');
  }

  getSalesPayments(): Observable<Payment[]> {
    return this.api.get<Payment[]>('/payments/sales');
  }

  create(payment: CreatePaymentRequest): Observable<Payment> {
    return this.api.post<Payment>('/payments', payment);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`/payments/${id}`);
  }
}
