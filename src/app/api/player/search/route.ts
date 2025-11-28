import { NextResponse } from "next/server";
import { getPlayerByNickname } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get("nickname");

    if (!nickname) {
      return NextResponse.json(
        { error: "Nickname is required" },
        { status: 400 }
      );
    }

    const player = await getPlayerByNickname(nickname);
    return NextResponse.json(player);
  } catch (error) {
    console.error("Error searching player:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Player not found" },
      { status: 404 }
    );
  }
}
