import { NextResponse } from "next/server";
import { menu } from "@/lib/db";

export async function GET() {
  return NextResponse.json(menu);
}
