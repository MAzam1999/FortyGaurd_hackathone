import { NextResponse } from "next/server";
import { handleAskAgentRequest } from "@/lib/heat-agent/respond";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
  const message = typeof body?.message === "string" ? body.message : "";

  const result = handleAskAgentRequest(message, process.env);
  return NextResponse.json(result);
}
