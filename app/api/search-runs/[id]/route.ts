import { NextResponse } from "next/server";
import { getSearchRunRecord } from "@/lib/search-runs-store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  const params = await context.params;
  const run = getSearchRunRecord(params.id);

  if (!run) {
    return NextResponse.json({ error: "Search run not found." }, { status: 404 });
  }

  return NextResponse.json(run);
}
