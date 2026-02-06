import { CartState } from "@/models/cart";
import ProductType from "@/models/product";
import { create } from "zustand";

export const useCart = create<CartState>((set) => ({
  items: [],
  total: 0,
  add(item: ProductType) {
    set((state) => {
      const found = state.items.find((i) => i.id === item.id);
      if (found) found.qty++;
      else state.items.push({ ...item, qty: 1 });
      return {
        items: [...state.items],
        total: state.total + item.price,
      };
    });
  },
  remove(item: ProductType) {
    set((state) => {
      const index = state.items.findIndex((i) => i.id === item.id);
      if (index > -1) {
        const cloned = [...state.items];
        if (cloned[index].qty > 1) {
          cloned[index].qty--;
        } else {
          cloned.splice(index, 1);
        }
        return { items: cloned, total: state.total - item.price };
      }
      return { items: [...state.items] };
    });
  },
  clear() {
    set({ items: [], total: 0 });
  },
}));
