jest.resetModules();

// Provide a minimal ReadableStream mock to capture enqueued chunks
class MockReadableStream {
  public chunks: any[] = [];
  static last: MockReadableStream | null = null;
  constructor(opts: any) {
    const controller = {
      enqueue: (chunk: any) => this.chunks.push(chunk),
    };
    if (opts && typeof opts.start === "function") opts.start(controller);
    (MockReadableStream as any).last = this;
  }
}

// Always replace the global ReadableStream with our mock so tests can inspect enqueued chunks
(global as any).ReadableStream = MockReadableStream as any;

if (typeof (global as any).Response === "undefined") {
  (global as any).Response = class {
    status: number;
    body: any;
    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status ?? 200;
    }
  } as any;
}

jest.mock("@/lib/orderLifecycle", () => ({
  simulateOrder: (order: any, notify: (o: any) => void) => {
    order.status = "Preparing";
    notify(order);
  },
}));

import { GET } from "@/app/api/status/[id]/route";
import { orders } from "@/lib/db";

describe("GET /api/status/[id]", () => {
  beforeEach(() => {
    for (const k of Object.keys(orders)) delete orders[k];
  });

  it("streams order updates for existing order", async () => {
    orders["o1"] = { id: "o1", status: "Order Received" } as any;

    const res = await GET(
      {} as any,
      { params: Promise.resolve({ id: "o1" }) } as any,
    );

    // Our MockReadableStream stores the last instance and its chunks
    const stream = (MockReadableStream as any).last as MockReadableStream;
    expect(stream).toBeTruthy();
    expect(stream.chunks.length).toBeGreaterThan(0);
    expect(String(stream.chunks[0])).toContain("data:");
  });

  it("returns 404 when order not found", async () => {
    const res = await GET(
      {} as any,
      { params: Promise.resolve({ id: "nope" }) } as any,
    );
    expect((res as any).status).toBe(404);
  });
});
