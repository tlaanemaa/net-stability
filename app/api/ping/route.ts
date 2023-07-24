import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge"; // 'nodejs' is the default

export function GET(request: NextRequest) {
  return new NextResponse("ok");
}
