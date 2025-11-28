import { NextResponse } from "next/server";
import { getPlayerHistory } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "20");
    const game = searchParams.get("game") || "cs2";

    const history = await getPlayerHistory(id, game, offset, limit);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching player history:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch player history" },
      { status: 404 }
    );
  }
}
