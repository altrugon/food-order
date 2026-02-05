"use client";

import { useEffect, useState } from "react";

export default function OrderStatus({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const es = new EventSource(`/api/status/${orderId}`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
    };

    return () => es.close();
  }, [orderId]);

  if (!status) return null;

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h3 className="font-semibold">Order Status</h3>
      <p className="text-lg">{status}</p>
    </div>
  );
}
