export interface Inventory {
  id?: number;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  totalQuantity: number;
}
