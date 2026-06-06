export interface PurchaseOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface SalesOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface PurchaseOrder {
  id?: number;
  supplier: string;
  orderDate?: string;
  expectedDelivery?: string;
  totalAmount: number;
  status: string;
  invoiceAttachment?: string;
  items: PurchaseOrderItem[];
}

export interface SalesOrder {
  id?: number;
  customerName: string;
  orderDate?: string;
  totalAmount: number;
  status: string;
  items: SalesOrderItem[];
}
