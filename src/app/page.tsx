"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Loader2,
  Target,
  Swords,
  BarChart3,
  Medal,
  Zap,
  Users,
  User,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [matchInput, setMatchInput] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleMatchSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchInput.trim() || isLoadingMatch) return;

    let matchId = matchInput.trim();

    if (matchId.includes("faceit.com")) {
      const parts = matchId.split("/");
      const roomIndex = parts.indexOf("room");
      if (roomIndex !== -1 && parts[roomIndex + 1]) {
        matchId = parts[roomIndex + 1];
      }
    }

    setIsLoadingMatch(true);
    router.push(`/match/${matchId}`);
  };

  const handlePlayerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim() || isLoadingPlayer) return;

    setIsLoadingPlayer(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/player/search?nickname=${encodeURIComponent(playerInput.trim())}`
      );

      if (!res.ok) {
        throw new Error("Player not found");
      }

      const player = await res.json();
      router.push(`/player/${player.player_id}`);
    } catch {
      setError("Player not found. Please check the nickname and try again.");
      setIsLoadingPlayer(false);
    }
  };

  const features = [
    {
      title: "Impact Matrix",
      description:
        "Go beyond K/D. Visualize impact vs survival with colored quadrants.",
      icon: Target,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Entry Analysis",
      description:
        "See who creates space. Analyze opening duel attempts vs success.",
      icon: Swords,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      title: "Team Comparison",
      description:
        "Compare total Kills, Assists, Utility Damage, and more side-by-side.",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Level vs Performance",
      description:
        "Check if higher FACEIT levels actually translate to better K/D.",
      icon: BarChart3,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      title: "Player Badges",
      description:
        "Earn unique titles based on playstyle like 'The Juggernaut'.",
      icon: Medal,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Advanced Stats",
      description:
        "Deep dive into Utility, Flash assists, Clutches, and Multikills.",
      icon: Zap,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-8 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
            FACEIT Insights
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform raw data into winning insights. Visualize the unseen
            impact and discover the true story behind the scoreboard.
          </p>
        </div>
      </section>

      {/* Search Cards Section */}
      <section className="relative z-10 flex-1 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Match Search Card */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden group hover:border-orange-500/30 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <Gamepad2 className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Match Insights
                    </h2>
                    <p className="text-sm text-slate-400">
                      Analyze any FACEIT match
                    </p>
                  </div>
                </div>

                <form onSubmit={handleMatchSearch} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Paste match link or ID..."
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-12 pl-4 pr-4 focus:border-orange-500/50 focus:ring-orange-500/20"
                      value={matchInput}
                      onChange={(e) => setMatchInput(e.target.value)}
                      disabled={isLoadingMatch}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 font-bold shadow-lg shadow-orange-900/20"
                    disabled={isLoadingMatch || !matchInput.trim()}
                  >
                    {isLoadingMatch ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Analyze Match
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-4 text-xs text-slate-500 text-center">
                  Supports CS2 matches from faceit.com
                </p>
              </CardContent>
            </Card>

            {/* Player Search Card */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden group hover:border-purple-500/30 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <User className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Player Profile
                    </h2>
                    <p className="text-sm text-slate-400">
                      View player stats & history
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePlayerSearch} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter FACEIT nickname..."
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-12 pl-4 pr-4 focus:border-purple-500/50 focus:ring-purple-500/20"
                      value={playerInput}
                      onChange={(e) => {
                        setPlayerInput(e.target.value);
                        setError(null);
                      }}
                      disabled={isLoadingPlayer}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 font-bold shadow-lg shadow-purple-900/20"
                    disabled={isLoadingPlayer || !playerInput.trim()}
                  >
                    {isLoadingPlayer ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-5 w-5" />
                        Find Player
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </>
                    )}
                  </Button>
                </form>

                {error && (
                  <p className="mt-4 text-sm text-red-400 text-center">
                    {error}
                  </p>
                )}
                {!error && (
                  <p className="mt-4 text-xs text-slate-500 text-center">
                    Search by exact FACEIT username
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            <h3 className="text-center text-lg font-semibold text-slate-300">
              Powerful Analytics Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${feature.border} ${feature.bg} backdrop-blur-sm hover:scale-105 transition-transform duration-300 text-center`}
                >
                  <feature.icon
                    className={`w-8 h-8 ${feature.color} mx-auto mb-2`}
                  />
                  <h4 className="font-semibold text-white text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-snug hidden md:block">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
