import { NextResponse } from "next/server";
import { getPlayerStats } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("game") || "cs2";

    const stats = await getPlayerStats(id, gameId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch player stats" },
      { status: 404 }
    );
  }
}
