"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trophy, Loader2, Target, Swords, BarChart3, Medal, Zap, Users } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Simple parsing logic:
    // If URL: https://www.faceit.com/en/cs2/room/1-1234... -> extract ID
    // If ID: use as is
    let matchId = input.trim();
    
    if (matchId.includes("faceit.com")) {
      const parts = matchId.split("/");
      // Usually the ID is after 'room'
      const roomIndex = parts.indexOf("room");
      if (roomIndex !== -1 && parts[roomIndex + 1]) {
        matchId = parts[roomIndex + 1];
      }
    }

    setIsLoading(true);
    router.push(`/match/${matchId}`);
  };

  const features = [
    {
      title: "Impact Matrix",
      description: "Go beyond K/D. Visualize impact vs survival with colored quadrants to find the real MVP.",
      icon: Target,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    },
    {
      title: "Entry Analysis",
      description: "See who creates space. Analyze opening duel attempts vs success rates.",
      icon: Swords,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20"
    },
    {
      title: "Team Comparison",
      description: "Tale of the Tape. Compare total Kills, Assists, Utility Damage, and more side-by-side.",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Level vs Performance",
      description: "Does Elo matter? Check if higher FACEIT levels actually translate to better K/D.",
      icon: BarChart3,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    {
      title: "Player Badges",
      description: "Earn unique titles like 'The Juggernaut', 'The Immortal', or 'The Tactician' based on playstyle.",
      icon: Medal,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      title: "Advanced Stats",
      description: "Deep dive into Utility usage, Flash assists, Clutch success rates, and Multikills.",
      icon: Zap,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-faceit-orange/5 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center space-y-12 text-center z-10">
        <div className="space-y-6">
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-relaxed">
            FACEIT Match Insights
          </h1>
          <p className="text-xl text-slate-400 max-w-[700px] mx-auto leading-relaxed">
            Transform raw data into winning insights. Visualize the unseen impact, analyze every duel, and discover the true story behind the scoreboard.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-lg flex gap-3 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-faceit-orange to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <Input
            type="text"
            placeholder="Paste Match Link or ID..."
            className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 h-14 text-lg pl-6 relative z-10 focus:ring-2 focus:ring-faceit-orange/50 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-faceit-orange hover:bg-faceit-orange/90 text-white h-14 px-8 font-bold min-w-[140px] relative z-10 shadow-lg shadow-orange-900/20 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Analyze
              </>
            )}
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left mt-16">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-xl border ${feature.border} ${feature.bg} backdrop-blur-md hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-center gap-3 mb-3">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                <h3 className="font-bold text-white text-lg">{feature.title}</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="pt-2 text-slate-600 text-sm">
          <p>Supports CS2 matches from faceit.com</p>
        </div>
      </div>
    </main>
  );
}
