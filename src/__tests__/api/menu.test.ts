jest.resetModules();

jest.mock("next/server", () => ({
  NextResponse: {
    json: (v: any) => ({ body: v }),
  },
}));

import { GET } from "@/app/api/menu/route";
import { menu } from "@/lib/db";

describe("GET /api/menu", () => {
  it("returns the menu array", async () => {
    const res = await GET();
    expect((res as any).body).toEqual(menu);
  });
});
