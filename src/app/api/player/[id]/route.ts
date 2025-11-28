import { NextResponse } from "next/server";
import { getPlayer } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await getPlayer(id);
    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch player" },
      { status: 404 }
    );
  }
}
