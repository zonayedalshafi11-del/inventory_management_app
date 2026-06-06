export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';
export type PaymentType = 'PURCHASE' | 'SALES';

export interface Payment {
  id: number;
  amount: number;
  method: PaymentMethod;
  paymentDate: string | null;
  type?: PaymentType;
  purchaseOrderId?: number;
  salesOrderId?: number;
  supplier?: string;
  customerName?: string;
  products?: string[];
}

export interface CreatePaymentRequest {
  amount: number;
  method: PaymentMethod;
  purchaseOrderId?: number;
  salesOrderId?: number;
}
