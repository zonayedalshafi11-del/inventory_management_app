import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { StockSummary, StockTransaction } from '../../shared/models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly api = inject(ApiService);

  getSummary(): Observable<StockSummary[]> {
    return this.api.get<StockSummary[]>('/stock/summary');
  }

  getTransactions(): Observable<StockTransaction[]> {
    return this.api.get<StockTransaction[]>('/stock/transactions');
  }

  getMovements(productId: number): Observable<StockTransaction[]> {
    return this.api.get<StockTransaction[]>(`/stock/movements/${productId}`);
  }
}
