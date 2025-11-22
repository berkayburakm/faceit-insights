"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/lib/types";
import { Trophy, Users } from "lucide-react";

interface ClutchPerformanceProps {
  players: Player[];
}

export function ClutchPerformance({ players }: ClutchPerformanceProps) {
  // Filter players who have at least one clutch win
  const clutchers = players
    .filter(
      (p) =>
        parseInt(p.player_stats["1v1Wins"]) > 0 ||
        parseInt(p.player_stats["1v2Wins"]) > 0 ||
        parseInt(p.player_stats["Clutch Kills"]) > 0
    )
    .sort((a, b) => parseInt(b.player_stats["Clutch Kills"]) - parseInt(a.player_stats["Clutch Kills"]))
    .slice(0, 6); // Top 6 clutchers

  return (
    <Card className="w-full bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Clutch Leaders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clutchers.map((player) => (
            <div
              key={player.player_id}
              className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col gap-2"
            >
              <div className="font-bold text-lg text-slate-200 truncate">
                {player.nickname}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Clutch Kills</span>
                <span className="font-mono text-faceit-orange font-bold">
                  {player.player_stats["Clutch Kills"]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-slate-900 p-2 rounded text-center">
                  <div className="text-xs text-slate-500">1v1 Wins</div>
                  <div className="font-bold text-green-400">
                    {player.player_stats["1v1Wins"]}
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded text-center">
                  <div className="text-xs text-slate-500">1v2 Wins</div>
                  <div className="font-bold text-blue-400">
                    {player.player_stats["1v2Wins"]}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {clutchers.length === 0 && (
            <div className="text-slate-500 col-span-full text-center py-4">
              No clutches recorded in this match.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
