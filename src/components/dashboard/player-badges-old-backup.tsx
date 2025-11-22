import { Player, Faction, MapEntity, LocationEntity } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DollarSign
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
}

export function PlayerBadges({ players, totalRounds, teams, map, location }: PlayerBadgesProps) {
  // Calculate badges for all players
  const playerBadgesMap = new Map<string, BadgeDef[]>();

  const addBadge = (playerId: string, badge: BadgeDef) => {
    const current = playerBadgesMap.get(playerId) || [];
    current.push(badge);
    playerBadgesMap.set(playerId, current);
  };

  // === CİDDİ VE PRESTİJ ROZETLERİ (İYİ OYNAYANLAR İÇİN) ===

  // 1. The Terminator (Most Multi-Kills)
  const terminator = [...players].sort((a, b) => 
    (parseInt(b.player_stats["Penta Kills"]) * 5 + parseInt(b.player_stats["Quadro Kills"]) * 4 + parseInt(b.player_stats["Triple Kills"]) * 3) - 
    (parseInt(a.player_stats["Penta Kills"]) * 5 + parseInt(a.player_stats["Quadro Kills"]) * 4 + parseInt(a.player_stats["Triple Kills"]) * 3)
  )[0];
  if (terminator && (parseInt(terminator.player_stats["Penta Kills"]) > 0 || parseInt(terminator.player_stats["Quadro Kills"]) > 0 || parseInt(terminator.player_stats["Triple Kills"]) > 0)) {
     addBadge(terminator.player_id, { 
       label: "The Terminator", 
       icon: Skull, 
       color: "bg-red-600",
       description: "Most multi-kills (Penta/Quadro/Triple)"
     });
  }

  // 2. Headhunter (Highest HS %)
  const headhunter = [...players].sort((a, b) => parseInt(b.player_stats["Headshots %"]) - parseInt(a.player_stats["Headshots %"]))[0];
  if (headhunter) {
      addBadge(headhunter.player_id, { 
        label: "Headhunter", 
        icon: Crosshair, 
        color: "bg-orange-500",
        description: "Highest Headshot Percentage"
      });
  }

  // 3. The Wall (Lowest Deaths - minimum rounds played check implied)
  const wall = [...players].sort((a, b) => parseInt(a.player_stats.Deaths) - parseInt(b.player_stats.Deaths))[0];
  if (wall) {
      addBadge(wall.player_id, { 
        label: "The Wall", 
        icon: Shield, 
        color: "bg-blue-600",
        description: "Hardest to kill (Lowest Deaths)"
      });
  }

  // 4. Assistant (Most Assists)
  const assistant = [...players].sort((a, b) => parseInt(b.player_stats.Assists) - parseInt(a.player_stats.Assists))[0];
  if (assistant && parseInt(assistant.player_stats.Assists) > 0) {
      addBadge(assistant.player_id, { 
        label: "Assistant", 
        icon: Zap, 
        color: "bg-yellow-500",
        description: "Most Assists"
      });
  }

  // 5. Entry / Aggressor (High KPR, Low Survival)
  const entry = [...players].sort((a, b) => {
      const survA = (totalRounds - parseInt(a.player_stats.Deaths)) / totalRounds;
      const survB = (totalRounds - parseInt(b.player_stats.Deaths)) / totalRounds;
      const kprA = parseFloat(a.player_stats["K/R Ratio"]);
      const kprB = parseFloat(b.player_stats["K/R Ratio"]);
      return (kprB * (1 - survB)) - (kprA * (1 - survA));
  })[0];
  if (entry) {
      addBadge(entry.player_id, { 
        label: "Aggressor", 
        icon: Swords, 
        color: "bg-purple-600",
        description: "High Impact, High Risk (Entry Fragger style)"
      });
  }

  // 6. MVP (Most MVPs)
  const mvp = [...players].sort((a, b) => parseInt(b.player_stats.MVPs) - parseInt(a.player_stats.MVPs))[0];
  if (mvp && parseInt(mvp.player_stats.MVPs) > 0) {
    addBadge(mvp.player_id, {
      label: "MVP",
      icon: Award,
      color: "bg-yellow-600",
      description: "Most Round MVPs"
    });
  }

  // 7. Sharpshooter (High K/D)
  const sharpshooter = [...players].sort((a, b) => parseFloat(b.player_stats["K/D Ratio"]) - parseFloat(a.player_stats["K/D Ratio"]))[0];
  if (sharpshooter && parseFloat(sharpshooter.player_stats["K/D Ratio"]) > 1.5) {
    addBadge(sharpshooter.player_id, {
      label: "Sharpshooter",
      icon: Target,
      color: "bg-emerald-500",
      description: "Highest K/D Ratio (> 1.5)"
    });
  }

  // 8. Ghost (0 Deaths? Rare, but maybe Low Deaths + High Kills)
  // Let's add "Carry" for highest kills
  const carry = [...players].sort((a, b) => parseInt(b.player_stats.Kills) - parseInt(a.player_stats.Kills))[0];
  if (carry) {
     // Avoid duplicate if they are also Terminator
     const existing = playerBadgesMap.get(carry.player_id) || [];
     if (!existing.some(b => b.label === "The Terminator")) {
        addBadge(carry.player_id, {
          label: "The Carry",
          icon: Flame,
          color: "bg-rose-500",
          description: "Most Kills"
        });
     }
  }

  // 9. Utility Nerd (Most Utility Damage)
  const utilityNerd = [...players].sort((a, b) => parseInt(b.player_stats["Utility Damage"]) - parseInt(a.player_stats["Utility Damage"]))[0];
  if (utilityNerd && parseInt(utilityNerd.player_stats["Utility Damage"]) > 0) {
    addBadge(utilityNerd.player_id, {
      label: "Utility Nerd",
      icon: Bomb,
      color: "bg-indigo-500",
      description: "Most Utility Damage"
    });
  }

  // 10. Blind Monk (Most Enemies Flashed)
  const blindMonk = [...players].sort((a, b) => parseInt(b.player_stats["Enemies Flashed"]) - parseInt(a.player_stats["Enemies Flashed"]))[0];
  if (blindMonk && parseInt(blindMonk.player_stats["Enemies Flashed"]) > 0) {
    addBadge(blindMonk.player_id, {
      label: "Blind Monk",
      icon: Eye,
      color: "bg-cyan-500",
      description: "Most Enemies Flashed"
    });
  }

  // 11. Clutch King (Most 1vX Wins)
  const clutchKing = [...players].sort((a, b) => 
    (parseInt(b.player_stats["1v1Wins"]) + parseInt(b.player_stats["1v2Wins"])) - 
    (parseInt(a.player_stats["1v1Wins"]) + parseInt(a.player_stats["1v2Wins"]))
  )[0];
  if (clutchKing && (parseInt(clutchKing.player_stats["1v1Wins"]) > 0 || parseInt(clutchKing.player_stats["1v2Wins"]) > 0)) {
    addBadge(clutchKing.player_id, {
      label: "Clutch King",
      icon: Crown,
      color: "bg-amber-500",
      description: "Most Clutch Wins (1v1 & 1v2)"
    });
  }

  // 12. Sniper Wolf (Most Sniper Kills)
  const sniperWolf = [...players].sort((a, b) => parseInt(b.player_stats["Sniper Kills"]) - parseInt(a.player_stats["Sniper Kills"]))[0];
  if (sniperWolf && parseInt(sniperWolf.player_stats["Sniper Kills"]) > 0) {
    addBadge(sniperWolf.player_id, {
      label: "Sniper Wolf",
      icon: Locate,
      color: "bg-green-600",
      description: "Most Sniper Kills"
    });
  }

  // 13. First Blood (Most First Kills)
  const firstBlood = [...players].sort((a, b) => parseInt(b.player_stats["First Kills"]) - parseInt(a.player_stats["First Kills"]))[0];
  if (firstBlood && parseInt(firstBlood.player_stats["First Kills"]) > 0) {
    addBadge(firstBlood.player_id, {
      label: "First Blood",
      icon: Swords,
      color: "bg-red-500",
      description: "Most Opening Kills"
    });
  }

  // --- "Bad" / Fun Badges ---

  // 14. The Tourist (Lowest ADR)
  const tourist = [...players].sort((a, b) => parseFloat(a.player_stats.ADR) - parseFloat(b.player_stats.ADR))[0];
  if (tourist) {
    addBadge(tourist.player_id, {
      label: "The Tourist",
      icon: Plane,
      color: "bg-gray-500",
      description: "Just visiting (Lowest ADR)"
    });
  }

  // 15. Target Practice (Most Deaths)
  const targetPractice = [...players].sort((a, b) => parseInt(b.player_stats.Deaths) - parseInt(a.player_stats.Deaths))[0];
  if (targetPractice) {
    addBadge(targetPractice.player_id, {
      label: "Target Practice",
      icon: Target,
      color: "bg-red-900",
      description: "Most Deaths"
    });
  }

  // 16. Stormtrooper (Lowest Headshot %)
  const stormtrooper = [...players].sort((a, b) => parseInt(a.player_stats["Headshots %"]) - parseInt(b.player_stats["Headshots %"]))[0];
  if (stormtrooper) {
    addBadge(stormtrooper.player_id, {
      label: "Stormtrooper",
      icon: Frown,
      color: "bg-stone-500",
      description: "Lowest Headshot %"
    });
  }

  // 17. Pacifist (Lowest Kills)
  const pacifist = [...players].sort((a, b) => parseInt(a.player_stats.Kills) - parseInt(b.player_stats.Kills))[0];
  if (pacifist) {
    addBadge(pacifist.player_id, {
      label: "Pacifist",
      icon: Hand,
      color: "bg-green-200 text-green-900",
      description: "Lowest Kills"
    });
  }

  return (
    <TooltipProvider>
      <div className="mb-4 flex flex-col gap-3">
        {/* Top header: teams, map and server location */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/** Team avatars — optional */}
            {teams?.faction1 && (
              <div className="flex items-center gap-2">
                <img src={teams.faction1.avatar} alt={teams.faction1.name} className="h-10 w-10 rounded-full object-cover border border-slate-700" />
                <span className="text-sm text-slate-200">{teams.faction1.name}</span>
              </div>
            )}
            <div className="text-slate-500">vs</div>
            {teams?.faction2 && (
              <div className="flex items-center gap-2">
                <img src={teams.faction2.avatar} alt={teams.faction2.name} className="h-10 w-10 rounded-full object-cover border border-slate-700" />
                <span className="text-sm text-slate-200">{teams.faction2.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/** Map image shown as a distinct rounded rectangle */}
            {map && (
              <div className="flex items-center gap-2 rounded-md bg-slate-800/60 p-1 border border-slate-700">
                <img src={map.image_sm} alt={map.name} className="h-12 w-20 object-cover rounded" />
                <div className="text-xs text-slate-200">{map.name}</div>
              </div>
            )}

            {/** Server / Location image */}
            {location && (
              <div className="flex items-center gap-2 rounded-md bg-slate-800/60 p-1 border border-slate-700">
                <img src={location.image_sm} alt={location.name} className="h-10 w-10 object-cover rounded" />
                <div className="text-xs text-slate-200">{location.name}</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => {
          const badges = playerBadgesMap.get(player.player_id) || [];
          
          return (
            <Card key={player.player_id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 truncate">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar} alt={player.nickname} />
                      <AvatarFallback>{player.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{player.nickname}</span>
                  </div>
                  <span className={`text-sm ${parseFloat(player.player_stats["K/D Ratio"]) >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                    {player.player_stats["K/D Ratio"]} K/D
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 min-h-6">
                  {badges.map((badge, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger>
                        <Badge className={`${badge.color} text-white border-none flex items-center gap-1 px-2 py-1 cursor-help`}>
                          <badge.icon size={12} />
                          {badge.label}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 text-slate-100 border-slate-700">
                        <p>{badge.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {badges.length === 0 && <span className="text-slate-600 text-xs italic py-1">No special badges</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>
    </TooltipProvider>
  );
}
