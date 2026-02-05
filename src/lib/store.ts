import { CartState } from "@/models/cart";
import ProductType from "@/models/product";
import { create } from "zustand";

export const useCart = create<CartState>((set) => ({
  items: [],
  add(item: ProductType) {
    set((state) => {
      const found = state.items.find((i) => i.id === item.id);
      if (found) found.qty++;
      else state.items.push({ ...item, qty: 1 });
      return { items: [...state.items] };
    });
  },
  remove(id: string) {
    set((state: any) => ({
      items: state.items.filter((i: any) => i.id !== id),
    }));
  },
  clear() {
    set({ items: [] });
  },
}));
