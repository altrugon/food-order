import ProductType from "./product";

export interface CartItem extends ProductType {
  qty: number;
}

export interface CartState {
  items: CartItem[];
  add(item: ProductType): void;
  remove(id: string): void;
  clear(): void;
}
