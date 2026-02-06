jest.resetModules();

if (typeof (global as any).Response === "undefined") {
  (global as any).Response = class {
    status: number;
    body: any;
    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status ?? 200;
    }
    static json(data: any) {
      return new (global as any).Response(data, { status: 200 });
    }
  } as any;
}

jest.mock("uuid", () => ({ v4: () => "fixed-id" }));

import { POST } from "@/app/api/orders/route";
import { orders } from "@/lib/db";

describe("POST /api/orders", () => {
  beforeEach(() => {
    for (const k of Object.keys(orders)) delete orders[k];
  });

  it("creates an order with valid payload", async () => {
    const payload = {
      items: [{ id: "1", qty: 1 }],
      total: 12,
      customer: { name: "Bob" },
    };
    const req = { json: async () => payload } as any;

    await POST(req);

    expect(orders["fixed-id"]).toBeDefined();
    expect(orders["fixed-id"].customer.name).toBe("Bob");
    expect(orders["fixed-id"].status).toBe("Order Received");
  });

  it("returns 400 for invalid order", async () => {
    const req = { json: async () => ({ items: [] }) } as any;
    const res = await POST(req);
    expect((res as any).status).toBe(400);
  });
});
