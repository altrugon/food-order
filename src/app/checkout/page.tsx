"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { useState } from "react";
import { CustomerType } from "@/models/customer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart((s: any) => s);

  const [form, setForm] = useState<CustomerType>({
    name: "",
    address: "",
    phone: "",
  });

  async function submit() {
    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items,
        total,
        customer: form,
      }),
    });

    const order = await res.json();

    clear();
    router.push(`/status/${order.id}`);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Delivery Details</h1>

      <input
        placeholder="Full name"
        className="w-full border p-3 rounded"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Delivery address"
        className="w-full border p-3 rounded"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <input
        placeholder="Phone number"
        className="w-full border p-3 rounded"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button
        disabled={!form.name || !form.address || !form.phone}
        onClick={submit}
        className="w-full bg-green-600 text-white py-3 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Checkout
      </button>
    </div>
  );
}
