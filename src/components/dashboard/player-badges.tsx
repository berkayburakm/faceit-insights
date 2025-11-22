"use client";

import { Player, Faction, MapEntity, LocationEntity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Crosshair, 
  Shield, 
  Skull, 
  Zap, 
  Swords, 
  Target, 
  Award, 
  Flame,
  Ghost,
  Bomb,
  Eye,
  Crown,
  Plane,
  Frown,
  Hand,
  Locate,
  Sparkles,
  Camera,
  Minus,
  Activity,
  Binoculars,
  AlertCircle,
  DollarSign,
  Heart,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlayerBadgesProps {
  players: Player[];
  totalRounds: number;
  teams?: { faction1: Faction; faction2: Faction };
  map?: MapEntity;
  location?: LocationEntity;
}

interface BadgeDef {
  label: string;
  icon: any;
  color: string;
  description: string;
  category: "combat" | "precision" | "tactics" | "clutch";
}

export function PlayerBadges({ players, totalRounds, teams, map, location }: PlayerBadgesProps) {
  const playerBadgesMap = new Map<string, BadgeDef[]>();

  const addBadge = (playerId: string, badge: BadgeDef) => {
    const current = playerBadgesMap.get(playerId) || [];
    current.push(badge);
    playerBadgesMap.set(playerId, current);
  };

  // === ⚔️ COMBAT & DOMINATION ===
  
  // 1. The Juggernaut - Highest Damage + ADR
  const juggernaut = [...players].sort((a, b) => 
    (parseInt(b.player_stats.Damage) + parseFloat(b.player_stats.ADR) * 100) - 
    (parseInt(a.player_stats.Damage) + parseFloat(a.player_stats.ADR) * 100)
  )[0];
  if (juggernaut) {
    addBadge(juggernaut.player_id, { 
      label: "The Juggernaut", 
      icon: Skull, 
      color: "bg-red-600",
      description: "The most destructive force in the server. Deals massive damage",
      category: "combat"
    });
  }

  // 2. Top Fragger - Highest Total Kills
  const topFragger = [...players].sort((a, b) => 
    parseInt(b.player_stats.Kills) - parseInt(a.player_stats.Kills)
  )[0];
  if (topFragger) {
    addBadge(topFragger.player_id, { 
      label: "Top Fragger", 
      icon: Flame, 
      color: "bg-orange-600",
      description: "The primary carry of the team. Eliminates the most enemies",
      category: "combat"
    });
  }

  // 3. The Immortal - Highest K/D or Fewest Deaths
  const immortal = [...players].sort((a, b) => {
    const kdB = parseFloat(b.player_stats["K/D Ratio"]);
    const kdA = parseFloat(a.player_stats["K/D Ratio"]);
    return kdB - kdA;
  })[0];
  if (immortal && parseFloat(immortal.player_stats["K/D Ratio"]) > 1.0) {
    addBadge(immortal.player_id, {
      label: "The Immortal",
      icon: Ghost,
      color: "bg-purple-600",
      description: "An elusive target. Extremely efficient and hard to trade",
      category: "combat"
    });
  }

  // 4. The Finisher - Highest K/R Ratio
  const finisher = [...players].sort((a, b) => 
    parseFloat(b.player_stats["K/R Ratio"]) - parseFloat(a.player_stats["K/R Ratio"])
  )[0];
  if (finisher && parseFloat(finisher.player_stats["K/R Ratio"]) > 0.6) {
    addBadge(finisher.player_id, {
      label: "The Finisher",
      icon: Target,
      color: "bg-rose-600",
      description: "Cleans up rounds and ensures damaged enemies do not survive",
      category: "combat"
    });
  }

  // === 🎯 PRECISION & WEAPONRY ===
  
  // 5. Headhunter - Highest HS% (min 10 kills)
  const headhunter = [...players].sort((a, b) => 
    parseInt(b.player_stats["Headshots %"]) - parseInt(a.player_stats["Headshots %"])
  )[0];
  if (headhunter && parseInt(headhunter.player_stats.Kills) >= 10) {
    addBadge(headhunter.player_id, { 
      label: "Headhunter", 
      icon: Crosshair, 
      color: "bg-orange-500",
      description: "Clinical precision. Eliminates opponents instantly with accurate crosshair placement",
      category: "precision"
    });
  }

  // 6. The Marksman - Most Sniper Kills
  const marksman = [...players].sort((a, b) => 
    parseInt(b.player_stats["Sniper Kills"]) - parseInt(a.player_stats["Sniper Kills"])
  )[0];
  if (marksman && parseInt(marksman.player_stats["Sniper Kills"]) > 0) {
    addBadge(marksman.player_id, {
      label: "The Marksman",
      icon: Locate,
      color: "bg-green-600",
      description: "Controls long angles and locks down lanes with the Big Green Gun",
      category: "precision"
    });
  }

  // 7. Gunslinger - Most Pistol Kills
  const gunslinger = [...players].sort((a, b) => 
    parseInt(b.player_stats["Pistol Kills"]) - parseInt(a.player_stats["Pistol Kills"])
  )[0];
  if (gunslinger && parseInt(gunslinger.player_stats["Pistol Kills"]) > 2) {
    addBadge(gunslinger.player_id, {
      label: "Gunslinger",
      icon: DollarSign,
      color: "bg-emerald-600",
      description: "Deadly on eco rounds. Turns disadvantageous fights into wins",
      category: "precision"
    });
  }

  // === 🛡️ TACTICS & TEAMWORK ===
  
  // 8. The Spearhead - Highest Entry Count + Success Rate
  const spearhead = [...players].sort((a, b) => {
    const scoreA = parseInt(a.player_stats["Entry Count"]) * (1 + parseFloat(a.player_stats["Match Entry Success Rate"]));
    const scoreB = parseInt(b.player_stats["Entry Count"]) * (1 + parseFloat(b.player_stats["Match Entry Success Rate"]));
    return scoreB - scoreA;
  })[0];
  if (spearhead && parseInt(spearhead.player_stats["Entry Count"]) > 0) {
    addBadge(spearhead.player_id, {
      label: "The Spearhead",
      icon: Swords,
      color: "bg-red-500",
      description: "The fearless Entry Fragger. Takes the first duel to open the bombsite",
      category: "tactics"
    });
  }

  // 9. The Tactician - Highest Enemies Flashed or Utility Damage
  const tactician = [...players].sort((a, b) => {
    const scoreA = parseInt(a.player_stats["Enemies Flashed"]) * 10 + parseInt(a.player_stats["Utility Damage"]);
    const scoreB = parseInt(b.player_stats["Enemies Flashed"]) * 10 + parseInt(b.player_stats["Utility Damage"]);
    return scoreB - scoreA;
  })[0];
  if (tactician && (parseInt(tactician.player_stats["Enemies Flashed"]) > 3 || parseInt(tactician.player_stats["Utility Damage"]) > 30)) {
    addBadge(tactician.player_id, {
      label: "The Tactician",
      icon: Bomb,
      color: "bg-indigo-600",
      description: "Uses utility effectively to blind opponents and set up teammates for success",
      category: "tactics"
    });
  }

  // 10. The Playmaker - Highest Assists
  const playmaker = [...players].sort((a, b) => 
    parseInt(b.player_stats.Assists) - parseInt(a.player_stats.Assists)
  )[0];
  if (playmaker && parseInt(playmaker.player_stats.Assists) > 3) {
    addBadge(playmaker.player_id, {
      label: "The Playmaker",
      icon: Zap,
      color: "bg-yellow-500",
      description: "The ultimate support player. Damage or utility that leads to teammate kills",
      category: "tactics"
    });
  }

  // === ❄️ CLUTCH & MENTAL ===
  
  // 11. The Closer - Most Clutch Kills or highest 1vX Win Rate
  const closer = [...players].sort((a, b) => {
    const scoreA = parseInt(a.player_stats["Clutch Kills"]) + parseInt(a.player_stats["1v1Wins"]) * 2 + parseInt(a.player_stats["1v2Wins"]) * 3;
    const scoreB = parseInt(b.player_stats["Clutch Kills"]) + parseInt(b.player_stats["1v1Wins"]) * 2 + parseInt(b.player_stats["1v2Wins"]) * 3;
    return scoreB - scoreA;
  })[0];
  if (closer && (parseInt(closer.player_stats["Clutch Kills"]) > 0 || parseInt(closer.player_stats["1v1Wins"]) > 0)) {
    addBadge(closer.player_id, {
      label: "The Closer",
      icon: Crown,
      color: "bg-amber-500",
      description: "Ice in their veins. Wins the round when left alone against multiple opponents",
      category: "clutch"
    });
  }

  // 12. First Blood - Highest First Kills
  const firstBlood = [...players].sort((a, b) => 
    parseInt(b.player_stats["First Kills"]) - parseInt(a.player_stats["First Kills"])
  )[0];
  if (firstBlood && parseInt(firstBlood.player_stats["First Kills"]) > 0) {
    addBadge(firstBlood.player_id, {
      label: "First Blood",
      icon: Award,
      color: "bg-red-700",
      description: "Consistently secures the opening kill, giving the team an immediate 5v4 advantage",
      category: "clutch"
    });
  }

  // Separate players by team
  const faction1Players = teams ? players.filter(p => p.player_stats.Team === teams.faction1.name) : [];
  const faction2Players = teams ? players.filter(p => p.player_stats.Team === teams.faction2.name) : [];

  // Sorting state
  type SortKey = 'nickname' | 'kd' | 'kills' | 'deaths' | 'adr' | 'hs' | 'damage' | 'assists';
  const [sortKey, setSortKey] = useState<SortKey>('kills');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortPlayers = (playerList: Player[]) => {
    return [...playerList].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortKey) {
        case 'nickname':
          aVal = a.nickname.toLowerCase();
          bVal = b.nickname.toLowerCase();
          break;
        case 'kd':
          aVal = parseFloat(a.player_stats["K/D Ratio"]);
          bVal = parseFloat(b.player_stats["K/D Ratio"]);
          break;
        case 'kills':
          aVal = parseInt(a.player_stats.Kills);
          bVal = parseInt(b.player_stats.Kills);
          break;
        case 'deaths':
          aVal = parseInt(a.player_stats.Deaths);
          bVal = parseInt(b.player_stats.Deaths);
          break;
        case 'adr':
          aVal = parseFloat(a.player_stats.ADR);
          bVal = parseFloat(b.player_stats.ADR);
          break;
        case 'hs':
          aVal = parseInt(a.player_stats["Headshots %"]);
          bVal = parseInt(b.player_stats["Headshots %"]);
          break;
        case 'damage':
          aVal = parseInt(a.player_stats.Damage);
          bVal = parseInt(b.player_stats.Damage);
          break;
        case 'assists':
          aVal = parseInt(a.player_stats.Assists);
          bVal = parseInt(b.player_stats.Assists);
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    return sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />;
  };

  const renderTeamTable = (teamPlayers: Player[], teamName: string, teamColor: string) => {
    const sortedPlayers = sortPlayers(teamPlayers);

    return (
      <div className="space-y-2">
        <h3 className={`text-lg font-bold ${teamColor} flex items-center gap-2`}>
          <Shield className="h-5 w-5" />
          {teamName}
        </h3>
          <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900/50">
              <TableHead 
                className="w-[220px] cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => handleSort('nickname')}
              >
                <div className="flex items-center">
                  Player
                  <SortIcon column="nickname" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[60px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('kd')}
              >
                <div className="flex items-center justify-center">
                  K/D
                  <SortIcon column="kd" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[60px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('kills')}
              >
                <div className="flex items-center justify-center">
                  K
                  <SortIcon column="kills" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[60px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('deaths')}
              >
                <div className="flex items-center justify-center">
                  D
                  <SortIcon column="deaths" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[60px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('assists')}
              >
                <div className="flex items-center justify-center">
                  A
                  <SortIcon column="assists" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[80px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('damage')}
              >
                <div className="flex items-center justify-center">
                  DMG
                  <SortIcon column="damage" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[80px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('adr')}
              >
                <div className="flex items-center justify-center">
                  ADR
                  <SortIcon column="adr" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[70px] cursor-pointer hover:bg-slate-800/50 transition-colors text-center"
                onClick={() => handleSort('hs')}
              >
                <div className="flex items-center justify-center">
                  HS%
                  <SortIcon column="hs" />
                </div>
              </TableHead>
              <TableHead className="text-left">Badges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player) => {
              const badges = playerBadgesMap.get(player.player_id) || [];
              const kd = parseFloat(player.player_stats["K/D Ratio"]);

              return (
                <TableRow key={player.player_id} className="border-slate-800 hover:bg-slate-900/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-slate-700">
                        <AvatarImage src={player.avatar} alt={player.nickname} />
                        <AvatarFallback className="bg-slate-800 text-faceit-orange text-xs font-bold">
                          {player.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-100">{player.nickname}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-center font-semibold ${kd >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {player.player_stats["K/D Ratio"]}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {player.player_stats.Kills}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {player.player_stats.Deaths}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {player.player_stats.Assists}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {player.player_stats.Damage}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {player.player_stats.ADR}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {player.player_stats["Headshots %"]}%
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((badge, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger>
                            <Badge className={`${badge.color} text-white border-none flex items-center gap-1 px-2 py-0.5 cursor-help`}>
                              <badge.icon size={12} />
                              <span className="text-xs font-semibold">{badge.label}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 text-slate-100 border-slate-700 max-w-xs">
                            <p className="font-medium text-sm">{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {badges.length === 0 && (
                        <span className="text-slate-600 text-xs italic">-</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {teams ? (
          <>
            {renderTeamTable(faction1Players, teams.faction1.name, 'text-orange-400')}
            {renderTeamTable(faction2Players, teams.faction2.name, 'text-blue-400')}
          </>
        ) : (
          renderTeamTable(players, 'All Players', 'text-slate-100')
        )}
      </div>
    </TooltipProvider>
  );
}
