import { Card, CardContent } from "@/components/ui/card";
import { RoundStats, Team } from "@/lib/types";
import Image from "next/image";
import { MapPin, Server } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderCardProps {
  roundStats: RoundStats;
  teamA: Team;
  teamB: Team;
  teamAScore: number;
  teamBScore: number;
  mapImage?: string;
  serverLocation?: string;
  serverLocationImage?: string;
  teamAAvatar?: string;
  teamBAvatar?: string;
}

export function HeaderCard({ 
  roundStats, 
  teamA, 
  teamB, 
  teamAScore, 
  teamBScore,
  mapImage,
  serverLocation,
  serverLocationImage,
  teamAAvatar,
  teamBAvatar
}: HeaderCardProps) {
  return (
    <Card className="w-full bg-slate-900 border-slate-800 mb-6 overflow-hidden">
      {/* Map Image Background - Enhanced Visibility */}

      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Team A with Avatar */}
          <div className="flex items-center gap-3 md:flex-row flex-col">
            <Avatar className="h-16 w-16 border-2 border-slate-700">
              <AvatarImage src={teamAAvatar || teamA.players[0]?.avatar} alt={teamA.team_stats.Team} />
              <AvatarFallback className="bg-slate-800 text-faceit-orange text-xl font-bold">
                {teamA.team_stats.Team.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold text-faceit-orange">{teamA.team_stats.Team}</span>

            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black text-white tracking-wider">
              {teamAScore} - {teamBScore}
            </div>
            <div className="text-sm text-slate-400 mt-1 flex flex-wrap items-center justify-center gap-2">
              <span>{roundStats.Map} • {roundStats.Rounds} Rounds</span>
              {(serverLocation || serverLocationImage) && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    {serverLocationImage ? (
                      <img src={serverLocationImage} alt={serverLocation || "Server"} className="h-4 w-6 object-cover rounded" />
                    ) : (
                      <Server className="h-3 w-3" />
                    )}
                    <span>{serverLocation || roundStats.Region}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Half Breakdown */}
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <span className="text-slate-600">1st:</span>
                <span className={parseInt(teamA.team_stats["First Half Score"]) > parseInt(teamB.team_stats["First Half Score"]) ? "text-green-400" : "text-slate-400"}>
                  {teamA.team_stats["First Half Score"]}
                </span>
                <span>:</span>
                <span className={parseInt(teamB.team_stats["First Half Score"]) > parseInt(teamA.team_stats["First Half Score"]) ? "text-green-400" : "text-slate-400"}>
                  {teamB.team_stats["First Half Score"]}
                </span>
              </div>
              <div className="w-px h-3 bg-slate-800" />
              <div className="flex items-center gap-1">
                <span className="text-slate-600">2nd:</span>
                <span className={parseInt(teamA.team_stats["Second Half Score"]) > parseInt(teamB.team_stats["Second Half Score"]) ? "text-green-400" : "text-slate-400"}>
                  {teamA.team_stats["Second Half Score"]}
                </span>
                <span>:</span>
                <span className={parseInt(teamB.team_stats["Second Half Score"]) > parseInt(teamA.team_stats["Second Half Score"]) ? "text-green-400" : "text-slate-400"}>
                  {teamB.team_stats["Second Half Score"]}
                </span>
              </div>
              {(parseInt(teamA.team_stats["Overtime score"] || "0") > 0 || parseInt(teamB.team_stats["Overtime score"] || "0") > 0) && (
                <>
                  <div className="w-px h-3 bg-slate-800" />
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600">OT:</span>
                    <span className={parseInt(teamA.team_stats["Overtime score"]) > parseInt(teamB.team_stats["Overtime score"]) ? "text-green-400" : "text-slate-400"}>
                      {teamA.team_stats["Overtime score"]}
                    </span>
                    <span>:</span>
                    <span className={parseInt(teamB.team_stats["Overtime score"]) > parseInt(teamA.team_stats["Overtime score"]) ? "text-green-400" : "text-slate-400"}>
                      {teamB.team_stats["Overtime score"]}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Team B with Avatar */}
          <div className="flex items-center gap-3 md:flex-row-reverse flex-col">
            <Avatar className="h-16 w-16 border-2 border-slate-700">
              <AvatarImage src={teamBAvatar || teamB.players[0]?.avatar} alt={teamB.team_stats.Team} />
              <AvatarFallback className="bg-slate-800 text-faceit-orange text-xl font-bold">
                {teamB.team_stats.Team.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-end">
              <span className="text-2xl font-bold text-faceit-orange">{teamB.team_stats.Team}</span>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
