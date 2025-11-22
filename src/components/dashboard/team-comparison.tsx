"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, Team } from "@/lib/types";
import { Crosshair, Skull, Zap, Trophy, Swords, HelpingHand, Bomb } from "lucide-react";

interface TeamComparisonProps {
  teamA: Team;
  teamB: Team;
  players: Player[];
}

export function TeamComparison({ teamA, teamB, players }: TeamComparisonProps) {
  // Helper to calculate total stats for a team
  const getTeamTotal = (teamName: string, statKey: string, isInt: boolean = true) => {
    return players
      .filter(p => p.player_stats.Team === teamName)
      .reduce((acc, p) => {
        const val = p.player_stats[statKey] || "0";
        return acc + (isInt ? parseInt(val) : parseFloat(val));
      }, 0);
  };

  // Calculate totals
  const stats = [
    {
      label: "Total Kills",
      icon: Swords,
      teamA: getTeamTotal(teamA.team_stats.Team, "Kills"),
      teamB: getTeamTotal(teamB.team_stats.Team, "Kills"),
    },
    {
      label: "Total Deaths",
      icon: Skull,
      teamA: getTeamTotal(teamA.team_stats.Team, "Deaths"),
      teamB: getTeamTotal(teamB.team_stats.Team, "Deaths"),
    },
    {
      label: "Total Assists",
      icon: HelpingHand,
      teamA: getTeamTotal(teamA.team_stats.Team, "Assists"),
      teamB: getTeamTotal(teamB.team_stats.Team, "Assists"),
    },
    {
      label: "First Kills",
      icon: Zap,
      teamA: getTeamTotal(teamA.team_stats.Team, "First Kills"),
      teamB: getTeamTotal(teamB.team_stats.Team, "First Kills"),
    },
    {
      label: "Clutch Kills",
      icon: Trophy,
      teamA: getTeamTotal(teamA.team_stats.Team, "Clutch Kills"),
      teamB: getTeamTotal(teamB.team_stats.Team, "Clutch Kills"),
    },
    {
      label: "Utility Damage",
      icon: Bomb,
      teamA: getTeamTotal(teamA.team_stats.Team, "Utility Damage"),
      teamB: getTeamTotal(teamB.team_stats.Team, "Utility Damage"),
    },
    {
      label: "Sniper Kills",
      icon: Crosshair,
      teamA: getTeamTotal(teamA.team_stats.Team, "Sniper Kills"),
      teamB: getTeamTotal(teamB.team_stats.Team, "Sniper Kills"),
    }
  ];

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100 text-center">Tale of the Tape</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, idx) => {
          const total = stat.teamA + stat.teamB;
          const teamAPercent = total === 0 ? 50 : (stat.teamA / total) * 100;
          const teamBPercent = total === 0 ? 50 : (stat.teamB / total) * 100;

          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-slate-300 px-1">
                <span className={stat.teamA > stat.teamB ? "text-faceit-orange" : "text-slate-400"}>{stat.teamA}</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <stat.icon className="w-4 h-4" />
                  <span className="uppercase text-xs tracking-wider">{stat.label}</span>
                </div>
                <span className={stat.teamB > stat.teamA ? "text-faceit-orange" : "text-slate-400"}>{stat.teamB}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-faceit-orange transition-all duration-500" 
                  style={{ width: `${teamAPercent}%`, opacity: stat.teamA > stat.teamB ? 1 : 0.5 }}
                />
                <div className="w-0.5 h-full bg-slate-950" />
                <div 
                  className="h-full bg-white transition-all duration-500" 
                  style={{ width: `${teamBPercent}%`, opacity: stat.teamB > stat.teamA ? 1 : 0.5 }}
                />
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-between px-1 text-xs text-slate-500 mt-4">
          <span>{teamA.team_stats.Team}</span>
          <span>{teamB.team_stats.Team}</span>
        </div>
      </CardContent>
    </Card>
  );
}
