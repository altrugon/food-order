import ProductType from "./product";

export interface CartItem extends ProductType {
  qty: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  add(item: ProductType): void;
  remove(item: ProductType): void;
  clear(): void;
}
