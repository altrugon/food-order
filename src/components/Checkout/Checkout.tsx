"use client";

import { useState } from "react";
import { useCart } from "@/lib/store";
import OrderStatus from "../OrderStatus";

export default function Checkout() {
  const items = useCart((s: any) => s.items);
  const clear = useCart((s: any) => s.clear);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items,
        customer: {
          name: "John Doe",
          address: "123 Main St",
          phone: "555-123",
        },
      }),
    });

    const order = await res.json();
    setOrderId(order.id);
    clear();
    setLoading(false);
  }

  return (
    <div className="border rounded p-4 space-y-4 bg-white">
      <h2 className="text-xl font-semibold">Checkout</h2>

      <button
        onClick={submit}
        disabled={!items.length || loading}
        className="w-full bg-green-600 text-white py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-auto"
      >
        Place Order
      </button>

      {orderId && <OrderStatus orderId={orderId} />}
    </div>
  );
}
