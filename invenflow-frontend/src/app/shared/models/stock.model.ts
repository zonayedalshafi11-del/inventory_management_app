export interface StockSummary {
  id: number;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  supplier: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | string;
}

export interface StockTransaction {
  type: 'IN' | 'OUT';
  productId: number;
  productName: string;
  quantity: number;
  reference: string;
  counterparty: string;
  date: string;
}
