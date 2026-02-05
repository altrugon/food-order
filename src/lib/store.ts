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
    set((state) => {
      const index = state.items.findIndex((i) => i.id === id);
      if (index > -1) {
        const cloned = [...state.items];
        if (cloned[index].qty > 1) {
          cloned[index].qty--;
          return { items: cloned };
        } else {
          cloned.splice(index, 1);
          return { items: cloned };
        }
      }
      return { items: [...state.items] };
    });
  },
  clear() {
    set({ items: [] });
  },
}));
