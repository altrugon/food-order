import { orders } from "@/lib/db";
import { simulateOrder } from "@/lib/orderLifecycle";

export async function GET(_: Request, { params }: any) {
  const order = orders[params.id];
  if (!order) return new Response("Not found", { status: 404 });

  const stream = new ReadableStream({
    start(controller) {
      simulateOrder(order, (updated) => {
        controller.enqueue(`data: ${JSON.stringify(updated)}\n\n`);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
