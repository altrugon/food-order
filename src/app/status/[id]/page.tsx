"use client";

import { useEffect, useState, use } from "react";
import { CustomerType } from "@/models/customer";
import { CartItem } from "@/models/cart";

type Order = {
  id: string;
  status: string;
  customer: CustomerType;
  items: CartItem[];
  total: number;
};

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/status/${id}`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setOrder(data);
    };

    return () => es.close();
  }, [id]);

  if (!order) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-lg">
        Loading order...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Order Tracking</h1>

      {/* Status */}
      <div className="text-center">
        <span className="inline-block px-6 py-2 rounded-full bg-blue-100 border border-blue-300 text-xl font-semibold">
          {order.status}
        </span>
      </div>

      {/* Customer Info */}
      <section className="border rounded p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
        <p>
          <strong>Name:</strong> {order.customer.name}
        </p>
        <p>
          <strong>Address:</strong> {order.customer.address}
        </p>
        <p>
          <strong>Phone:</strong> {order.customer.phone}
        </p>
      </section>

      {/* Order Items */}
      <section className="border rounded p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-1">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>€{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-lg pt-3">
          <span>Total</span>
          <span>€{order.total.toFixed(2)}</span>
        </div>
      </section>
    </div>
  );
}
