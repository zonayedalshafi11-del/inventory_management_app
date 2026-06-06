export interface Product {
  id?: number;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  reorderLevel: number;
  status: string;
  supplier: string;
}
