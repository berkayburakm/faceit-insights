import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayer, getPlayerHistory, getPlayerStats } from "@/lib/api";
import { PlayerProfile } from "@/components/player/player-profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface PlayerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const player = await getPlayer(id);
    
    return {
      title: `${player.nickname} - FACEIT Stats & Profile`,
      description: `View ${player.nickname}'s FACEIT stats, match history, and performance analytics. Level ${player.games.cs2.skill_level}, ${player.games.cs2.faceit_elo} ELO.`,
      openGraph: {
        title: `${player.nickname} - FACEIT Stats`,
        description: `Level ${player.games.cs2.skill_level} • ${player.games.cs2.faceit_elo} ELO • ${player.country.toUpperCase()}`,
        images: [player.avatar || player.cover_image || ""],
      },
    };
  } catch (error) {
    return {
      title: "Player Not Found",
      description: "Could not fetch player details.",
    };
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;

  try {
    const [player, history, stats] = await Promise.all([
      getPlayer(id),
      getPlayerHistory(id, "cs2", 0, 15).catch(() => null),
      getPlayerStats(id).catch(() => null),
    ]);

    return <PlayerProfile player={player} history={history} stats={stats} />;
  } catch (error) {
    // If player fetch fails, it's likely a 404 or API error
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 text-lg font-semibold">Error</p>
              <p className="text-slate-400 mt-2">
                {(error as Error).message || "Player not found"}
              </p>
              <Button className="mt-4 bg-faceit-orange hover:bg-orange-600" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
