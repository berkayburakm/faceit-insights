"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Target,
  Crosshair,
  Percent,
  TrendingUp,
  Clock,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Flame,
  BadgeCheck,
  CircleCheck,
} from "lucide-react";
import { FaceitPlayer, MatchHistoryResponse, PlayerLifetimeStats, MatchHistoryItem } from "@/lib/types";
import { SkillLevelIcon } from "@/components/ui/skill-level-icon";

export default function PlayerPage() {
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<FaceitPlayer | null>(null);
  const [history, setHistory] = useState<MatchHistoryResponse | null>(null);
  const [stats, setStats] = useState<PlayerLifetimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayerData() {
      try {
        setLoading(true);
        const [playerRes, historyRes, statsRes] = await Promise.all([
          fetch(`/api/player/${playerId}`),
          fetch(`/api/player/${playerId}/history?limit=15`),
          fetch(`/api/player/${playerId}/stats`),
        ]);

        console.log("[PlayerPage] API responses", {
          player: playerRes.status,
          history: historyRes.status,
          stats: statsRes.status,
        });

        if (!playerRes.ok) throw new Error("Failed to fetch player data");
        
        const playerData = await playerRes.json();
        console.log("[PlayerPage] player data", playerData);
        setPlayer(playerData);

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          console.log("[PlayerPage] history data", historyData);
          setHistory(historyData);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          console.log("[PlayerPage] stats data", statsData);
          setStats(statsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (playerId) {
      fetchPlayerData();
    }
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading player data...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive text-lg font-semibold">Error</p>
              <p className="text-muted-foreground mt-2">{error || "Player not found"}</p>
              <Button className="mt-4" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cs2Data = player.games?.cs2;
  const lifetime = stats?.lifetime;
  const recentResults = (lifetime?.["Recent Results"] as string[] | undefined)?.slice(0, 6);

  function getSkillLevelColor(level: number): string {
    if (level >= 10) return "text-red-500";
    if (level >= 8) return "text-orange-500";
    if (level >= 6) return "text-yellow-500";
    if (level >= 4) return "text-green-500";
    return "text-gray-500";
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const dayMonth = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dayMonth} - ${time}`;
  }

  function getMatchResult(match: MatchHistoryItem): { result: "win" | "loss"; score: string; team: string } {
    const isInFaction1 = match.teams.faction1.players.some((p) => p.player_id === playerId);
    const playerFaction = isInFaction1 ? "faction1" : "faction2";
    const opponentFaction = isInFaction1 ? "faction2" : "faction1";
    
    const isWin = match.results.winner === playerFaction;
    const playerScore = match.results.score[playerFaction] || 0;
    const opponentScore = match.results.score[opponentFaction] || 0;
    
    return {
      result: isWin ? "win" : "loss",
      score: `${playerScore} - ${opponentScore}`,
      team: isInFaction1 ? match.teams.faction1.nickname : match.teams.faction2.nickname,
    };
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Hero Section */}
      <div className="relative h-[250px] w-full group overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-950/60 to-slate-950 z-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />
        {player.cover_image ? (
          <img
            src={player.cover_image}
            alt="Cover"
            className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-1000 scale-105 group-hover:scale-100"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-purple-900/20 via-slate-900 to-cyan-900/20" />
        )}
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-20 pb-8 pt-20 bg-linear-to-t from-slate-950 to-transparent">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-end gap-8">
            {/* Avatar with Level Border */}
            <div className="relative group/avatar">
              <div className={`absolute -inset-0.5 rounded-full blur opacity-50 group-hover/avatar:opacity-100 transition-opacity duration-500`}></div>
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-slate-950 shadow-2xl relative ring-2 ring-white/10">
                <AvatarImage src={player.avatar} alt={player.nickname} />
                <AvatarFallback className="text-4xl bg-slate-900 text-slate-100 font-bold">
                  {player.nickname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {cs2Data && (
                <div className="absolute -bottom-2 -right-2 bg-slate-950 rounded-full p-1.5 shadow-lg border border-slate-800">
                   <SkillLevelIcon level={cs2Data.skill_level} className="h-10 w-10" />
                </div>
              )}
            </div>

            {/* Player Details */}
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl">
                  {player.nickname}
                </h1>
                {player.verified && (
                  <div className="bg-cyan-500/10 p-1.5 rounded-full border border-cyan-500/20 backdrop-blur-sm">
                    <BadgeCheck className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium text-lg">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                   <img
                    src={`https://flagcdn.com/24x18/${player.country.toLowerCase()}.png`}
                    alt={player.country}
                    className="rounded shadow-sm opacity-90"
                  />
                   <span className="text-slate-200 uppercase">{player.country}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                   <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24" className="styles__StyledISvg-sc-b4ec5d1e-1 jpfGXz"><path d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0115 6a2.99 2.99 0 011.454.375l1.921-1.921a3 3 0 111.5 1.328l-2.093 2.093a3 3 0 11-5.49-.168l-1.999-2a2.992 2.992 0 01-2.418.074L5.782 7.876a3 3 0 11-1.328-1.5l1.921-1.921A3 3 0 1112 3z" fill="currentColor"></path></svg>
                   <span className="text-white font-bold">{cs2Data?.faceit_elo}</span>
                   <span className="text-slate-400 text-md">ELO</span>
                </div>
                {recentResults && recentResults.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                    <span className="text-md uppercase tracking-wider text-slate-400">Form</span>
                    <div className="flex gap-1">
                      {recentResults.map((result, index) => (
                        <span
                          key={index}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-semibold ${
                            result === "1"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {result === "1" ? "W" : "L"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mb-4 flex gap-3">
               <Button 
                 variant="outline" 
                 size="lg"
                 className="bg-faceit-orange/10 border-faceit-orange/20 hover:bg-faceit-orange/20 text-faceit-orange backdrop-blur-sm transition-all hover:scale-105 font-bold"
                 asChild
               >
                <a href={player.faceit_url.replace('/{lang}', '')} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  FACEIT Profile
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Lifetime Stats */}
        {lifetime && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Lifetime Performance</h2>
                <p className="text-slate-400">Career statistics across all matches</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* K/D Ratio - Featured Card */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/80 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex gap-4 items-center mb-4">
                    
                    <Badge variant="outline" className="bg-cyan-500/5 border-cyan-500/20 text-cyan-400">
                      K/D Ratio
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Target className="h-5 w-5" />
                        </div>
                    <span className="text-4xl font-black text-white tracking-tight">{lifetime["Average K/D Ratio"]}</span>
                    </div>
                    <p className="text-sm text-slate-400">Average Kill/Death Ratio</p>
                  </div>
                </CardContent>
              </Card>

              {/* Win Rate */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/80 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex gap-4 items-center mb-4">
                    <Badge variant="outline" className="bg-green-500/5 border-green-500/20 text-green-400">
                      Win Rate
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <span className="text-4xl font-black text-white tracking-tight">{lifetime["Win Rate %"]}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${lifetime["Win Rate %"]}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-400 flex justify-between">
                      <span>{lifetime.Wins} Wins</span>
                      <span>{parseInt(lifetime.Matches) - parseInt(lifetime.Wins)} Losses</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Matches */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/80 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex gap-4 items-center mb-4">
                    <Badge variant="outline" className="bg-blue-500/5 border-blue-500/20 text-blue-400">
                      Matches
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <CircleCheck className="h-5 w-5" />
                      </div>
                      <span className="text-4xl font-black text-white tracking-tight">{lifetime.Matches}</span>
                    </div>
                    <p className="text-sm text-slate-400">Total Matches Played</p>
                  </div>
                </CardContent>
              </Card>

              {/* Headshot % */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/80 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex gap-4 items-center mb-4">
                    <Badge variant="outline" className="bg-orange-500/5 border-orange-500/20 text-orange-400">
                      Headshots
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                      <Crosshair className="h-5 w-5" />
                      </div>
                      <span className="text-4xl font-black text-white tracking-tight">{lifetime["Average Headshots %"]}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${lifetime["Average Headshots %"]}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-400">Average HS Percentage</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Match History */}
        <section className="mt-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Match History</h2>
              <p className="text-slate-400">Recent competitive matches</p>
            </div>
          </div>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden py-0">
            <CardContent className="p-0">
              {history?.items && history.items.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-900/50">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400 font-medium">Date</TableHead>
                          <TableHead className="text-slate-400 font-medium">Competition</TableHead>
                          <TableHead className="text-slate-400 font-medium">Result</TableHead>
                          <TableHead className="text-slate-400 font-medium">Score</TableHead>
                          <TableHead className="text-right text-slate-400 font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.items.map((match) => {
                          const matchResult = getMatchResult(match);
                          return (
                            <TableRow 
                              key={match.match_id} 
                              className="border-slate-800 hover:bg-slate-800/50 transition-colors group"
                            >
                              <TableCell className="text-slate-300 font-medium">
                                {formatDate(match.finished_at)}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                  {match.competition_name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`border-0 ${
                                    matchResult.result === "win"
                                      ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                                      : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                                  }`}
                                >
                                  {matchResult.result.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-slate-300 font-bold">
                                {matchResult.score}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <a
                                    href={`https://www.faceit.com/en/csgo/match/${match.match_id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-full border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-blue-400 hover:text-white transition"
                                  >
                                    FACEIT Room
                                    <ExternalLink className="h-3 w-3 ml-1 opacity-80" />
                                  </a>
                                  <Link
                                    href={`/match/${match.match_id}`}
                                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-full border border-slate-800 bg-slate-900/60 text-slate-200 hover:border-cyan-400 hover:text-white transition"
                                  >
                                    Insights
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                    <Clock className="h-8 w-8 opacity-50" />
                  </div>
                  <p>No match history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
