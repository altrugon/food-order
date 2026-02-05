"use client";

import { useCart } from "@/lib/store";

export default function Cart() {
  const { items, clear } = useCart((s: any) => s);

  const total = items.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);

  return (
    <div className="border rounded p-4 space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Cart</h2>

      {items.length === 0 && (
        <p className="text-gray-500">Your cart is empty</p>
      )}

      {items.map((item: any) => (
        <div key={item.id} className="flex justify-between">
          <span>
            {item.name} × {item.qty}
          </span>
          <span>€{(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <div className="border-t pt-2 flex justify-between font-bold">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>

      <div className="flex gap-2">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={clear}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
