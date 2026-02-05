import { v4 as uuid } from "uuid";
import { orders } from "@/lib/db";

export async function POST(req: Request) {
  const { items, customer } = await req.json();

  if (!items?.length || !customer?.name) {
    return new Response("Invalid order", { status: 400 });
  }

  const id = uuid();

  orders[id] = {
    id,
    items,
    customer,
    status: "Order Received",
    createdAt: Date.now(),
  };

  return Response.json(orders[id]);
}
