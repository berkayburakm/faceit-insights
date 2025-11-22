"use client";

import { Player, Faction } from "@/lib/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ScriptableContext
} from 'chart.js';
import { Bar, Radar, Scatter, Bubble } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MatchAnalyticsProps {
  players: Player[];
  teams?: { faction1: Faction; faction2: Faction };
}

const COLORS = {
  faction1: "#f97316", // Orange
  faction2: "#3b82f6", // Blue
  neutral: "#94a3b8",
  success: "#22c55e",
  warning: "#eab308",
  danger: "#ef4444",
  purple: "#a855f7",
  pink: "#ec4899",
  cyan: "#06b6d4",
};

export function MatchAnalytics({ players, teams }: MatchAnalyticsProps) {
  // Helper to get team color
  const getTeamColor = (teamName: string) => {
    if (!teams) return COLORS.neutral;
    return teamName === teams.faction1.name ? COLORS.faction1 : COLORS.faction2;
  };

  // Common Chart Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#1e293b',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        border: { display: false }
      },
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        border: { display: false }
      }
    }
  };

  // 1. Impact Matrix Data (Scatter)
  const impactData: ChartData<"scatter"> = {
    datasets: players.map(p => ({
      label: p.nickname,
      data: [{
        x: parseFloat(p.player_stats["K/D Ratio"]),
        y: parseFloat(p.player_stats.ADR)
      }],
      backgroundColor: getTeamColor(p.player_stats.Team),
      pointRadius: 6,
    }))
  };

  const impactOptions: ChartOptions<"scatter"> = {
    ...commonOptions,
    clip: false,
    layout: {
      padding: 20
    },
    plugins: {
      ...commonOptions.plugins,
      legend: { display: false }, // Too many players for legend
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => {
            const p = players.find(pl => pl.nickname === ctx.dataset.label);
            return `${ctx.dataset.label}: K/D ${ctx.parsed.x}, ADR ${ctx.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'K/D Ratio', color: '#94a3b8' } },
      y: { ...commonOptions.scales.y, title: { display: true, text: 'ADR', color: '#94a3b8' } }
    }
  };

  // 2. Entry Duel Data (Bubble)
  // Bubble: x=Entry Count, y=Success Rate, r=First Kills
  const entryData: ChartData<"bubble"> = {
    datasets: players
      .filter(p => parseInt(p.player_stats["Entry Count"]) > 0)
      .map(p => ({
        label: p.nickname,
        data: [{
          x: parseInt(p.player_stats["Entry Count"]),
          y: parseFloat(p.player_stats["Match Entry Success Rate"]) * 100,
          r: Math.max(5, parseInt(p.player_stats["First Kills"]) * 2) // Scale radius
        }],
        backgroundColor: getTeamColor(p.player_stats.Team),
      }))
  };

  const entryOptions: ChartOptions<"bubble"> = {
    ...commonOptions,
    clip: false,
    layout: {
      padding: 20
    },
    plugins: {
      ...commonOptions.plugins,
      legend: { display: false },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => {
             const raw = ctx.raw as any;
             return `${ctx.dataset.label}: Entries ${raw.x}, Success ${raw.y.toFixed(1)}%, First Kills ${raw.r / 2}`;
          }
        }
      }
    },
    scales: {
      x: { ...commonOptions.scales.x, title: { display: true, text: 'Entry Count', color: '#94a3b8' } },
      y: { 
        ...commonOptions.scales.y, 
        max: 100,
        min: 0,
        title: { display: true, text: 'Success Rate (%)', color: '#94a3b8' }
      }
    }
  };

  // 3. Utility Data (Bar)
  const sortedUtilPlayers = [...players].sort((a, b) => 
    parseInt(b.player_stats["Utility Damage"] || "0") - parseInt(a.player_stats["Utility Damage"] || "0")
  );

  const utilityData: ChartData<"bar"> = {
    labels: sortedUtilPlayers.map(p => p.nickname),
    datasets: [
      {
        label: 'Flash Count',
        data: sortedUtilPlayers.map(p => parseInt(p.player_stats["Flash Count"] || "0")),
        backgroundColor: '#64748b',
        yAxisID: 'y',
      },
      {
        label: 'Enemies Flashed',
        data: sortedUtilPlayers.map(p => parseInt(p.player_stats["Enemies Flashed"] || "0")),
        backgroundColor: '#eab308',
        yAxisID: 'y',
      },
      {
        label: 'Utility Damage',
        data: sortedUtilPlayers.map(p => parseInt(p.player_stats["Utility Damage"] || "0")),
        backgroundColor: '#ef4444',
        yAxisID: 'y1', // Separate axis for damage
      }
    ]
  };

  const utilityOptions: ChartOptions<"bar"> = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x },
      y: { ...commonOptions.scales.y, position: 'left', title: { display: true, text: 'Count', color: '#94a3b8' } },
      y1: { 
        position: 'right', 
        grid: { display: false },
        ticks: { color: '#ef4444' },
        title: { display: true, text: 'Damage', color: '#ef4444' }
      }
    }
  };

  // 4. Kill Distribution (Stacked Bar)
  const sortedKillPlayers = [...players].sort((a, b) => parseInt(b.player_stats.Kills) - parseInt(a.player_stats.Kills));
  
  const killTypeData: ChartData<"bar"> = {
    labels: sortedKillPlayers.map(p => p.nickname),
    datasets: [
      {
        label: 'Sniper',
        data: sortedKillPlayers.map(p => parseInt(p.player_stats["Sniper Kills"])),
        backgroundColor: '#22c55e',
        stack: 'Stack 0',
      },
      {
        label: 'Pistol',
        data: sortedKillPlayers.map(p => parseInt(p.player_stats["Pistol Kills"])),
        backgroundColor: '#eab308',
        stack: 'Stack 0',
      },
      {
        label: 'Rifle/Other',
        data: sortedKillPlayers.map(p => {
           const total = parseInt(p.player_stats.Kills);
           const sniper = parseInt(p.player_stats["Sniper Kills"]);
           const pistol = parseInt(p.player_stats["Pistol Kills"]);
           return Math.max(0, total - sniper - pistol);
        }),
        backgroundColor: '#3b82f6',
        stack: 'Stack 0',
      }
    ]
  };

  // 5. Multikill Data (Grouped Bar)
  const multikillPlayers = players.filter(p => 
    (parseInt(p.player_stats["Double Kills"] || "0") + 
     parseInt(p.player_stats["Triple Kills"] || "0") + 
     parseInt(p.player_stats["Quadro Kills"] || "0") + 
     parseInt(p.player_stats["Penta Kills"] || "0")) > 0
  ).sort((a, b) => parseInt(b.player_stats.Kills) - parseInt(a.player_stats.Kills)); // Sort by kills roughly

  const multikillData: ChartData<"bar"> = {
    labels: multikillPlayers.map(p => p.nickname),
    datasets: [
      { label: '2k', data: multikillPlayers.map(p => parseInt(p.player_stats["Double Kills"] || "0")), backgroundColor: '#64748b' },
      { label: '3k', data: multikillPlayers.map(p => parseInt(p.player_stats["Triple Kills"] || "0")), backgroundColor: '#3b82f6' },
      { label: '4k', data: multikillPlayers.map(p => parseInt(p.player_stats["Quadro Kills"] || "0")), backgroundColor: '#a855f7' },
      { label: '5k', data: multikillPlayers.map(p => parseInt(p.player_stats["Penta Kills"] || "0")), backgroundColor: '#ef4444' },
    ]
  };

  // 6. Team Comparison (Radar)
  const getTeamStats = (teamName: string) => {
    const teamPlayers = players.filter(p => p.player_stats.Team === teamName);
    if (teamPlayers.length === 0) return null;
    
    const avg = (key: string, parse = parseFloat) => 
      teamPlayers.reduce((sum, p) => sum + parse(p.player_stats[key] || "0"), 0) / teamPlayers.length;

    return {
      ADR: avg("ADR"),
      "HS%": avg("Headshots %", parseInt),
      "Entry%": avg("Match Entry Success Rate") * 100,
      "Util Dmg": avg("Utility Damage", parseInt),
      "Flash Success": (teamPlayers.reduce((sum, p) => sum + parseInt(p.player_stats["Enemies Flashed"] || "0"), 0) / 
                       Math.max(1, teamPlayers.reduce((sum, p) => sum + parseInt(p.player_stats["Flash Count"] || "0"), 0))) * 100,
      "K/D": avg("K/D Ratio") * 100, 
    };
  };

  const team1Stats = teams ? getTeamStats(teams.faction1.name) : null;
  const team2Stats = teams ? getTeamStats(teams.faction2.name) : null;

  const radarData: ChartData<"radar"> = {
    labels: ["ADR", "HS%", "Entry Win %", "Util Dmg", "Flash Eff %", "K/D x100"],
    datasets: []
  };

  if (team1Stats && team2Stats) {
    radarData.datasets.push({
      label: teams?.faction1.name || "Team A",
      data: [team1Stats.ADR, team1Stats["HS%"], team1Stats["Entry%"], team1Stats["Util Dmg"], team1Stats["Flash Success"], team1Stats["K/D"]],
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      borderColor: COLORS.faction1,
      pointBackgroundColor: COLORS.faction1,
    });
    radarData.datasets.push({
      label: teams?.faction2.name || "Team B",
      data: [team2Stats.ADR, team2Stats["HS%"], team2Stats["Entry%"], team2Stats["Util Dmg"], team2Stats["Flash Success"], team2Stats["K/D"]],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: COLORS.faction2,
      pointBackgroundColor: COLORS.faction2,
    });
  }

  const radarOptions: ChartOptions<"radar"> = {
    ...commonOptions,
    scales: {
      r: {
        angleLines: { color: '#334155' },
        grid: { color: '#334155' },
        pointLabels: { color: '#94a3b8' },
        ticks: { display: false, backdropColor: 'transparent' }
      }
    }
  };

  // 7. Clutch Data (Bar)
  const clutchPlayers = players.filter(p => 
    (parseInt(p.player_stats["1v1Count"] || "0") + parseInt(p.player_stats["1v2Count"] || "0")) > 0
  ).sort((a, b) => 
    (parseInt(b.player_stats["1v1Wins"] || "0") + parseInt(b.player_stats["1v2Wins"] || "0")) - 
    (parseInt(a.player_stats["1v1Wins"] || "0") + parseInt(a.player_stats["1v2Wins"] || "0"))
  );

  const clutchData: ChartData<"bar"> = {
    labels: clutchPlayers.map(p => p.nickname),
    datasets: [
      {
        label: 'Attempts',
        data: clutchPlayers.map(p => parseInt(p.player_stats["1v1Count"] || "0") + parseInt(p.player_stats["1v2Count"] || "0")),
        backgroundColor: '#64748b',
      },
      {
        label: 'Wins',
        data: clutchPlayers.map(p => parseInt(p.player_stats["1v1Wins"] || "0") + parseInt(p.player_stats["1v2Wins"] || "0")),
        backgroundColor: '#eab308',
      }
    ]
  };

  // 8. Level vs Performance (Bar sorted by Level)
  const sortedLevelPlayers = [...players].sort((a, b) => (a.game_skill_level || 0) - (b.game_skill_level || 0));

  const levelBarData: ChartData<"bar"> = {
    labels: sortedLevelPlayers.map(p => `${p.nickname} (Lvl ${p.game_skill_level || "?"})`),
    datasets: [
      {
        label: 'K/D Ratio',
        data: sortedLevelPlayers.map(p => parseFloat(p.player_stats["K/D Ratio"])),
        backgroundColor: sortedLevelPlayers.map(p => getTeamColor(p.player_stats.Team)),
      }
    ]
  };

  const levelBarOptions: ChartOptions<"bar"> = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: { display: false },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => {
             const p = sortedLevelPlayers[ctx.dataIndex];
             return `${p.nickname}: Level ${p.game_skill_level}, K/D ${ctx.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: { 
        ...commonOptions.scales.x, 
        ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 45 }
      },
      y: { 
        ...commonOptions.scales.y, 
        title: { display: true, text: 'K/D Ratio', color: '#94a3b8' },
        grace: '10%'
      }
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-900/50">
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="entry">Entry</TabsTrigger>
          <TabsTrigger value="utility">Utility</TabsTrigger>
          <TabsTrigger value="weapons">Weapons</TabsTrigger>
          <TabsTrigger value="multikill">Multikill</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="clutch">Clutch</TabsTrigger>
          <TabsTrigger value="level">Level vs Perf</TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Impact Matrix: ADR vs K/D</CardTitle>
              <CardDescription className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm pt-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500"></span> 
                  High Impact & Survival (MVP)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500/20 border border-yellow-500"></span> 
                  High Impact, Low Survival (Aggressive)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500"></span> 
                  Low Impact, High Survival (Passive)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500"></span> 
                  Low Impact & Survival (Struggling)
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Scatter options={impactOptions} data={impactData} plugins={[{
                id: 'quadrants-impact',
                beforeDraw: (chart) => {
                  const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
                  const midX = x.getPixelForValue((x.max + x.min) / 2);
                  const midY = y.getPixelForValue((y.max + y.min) / 2);

                  ctx.save();
                  
                  // Top Left (Low K/D, High ADR) - Yellow tint
                  ctx.fillStyle = 'rgba(234, 179, 8, 0.1)';
                  ctx.fillRect(left, top, midX - left, midY - top);
                  
                  // Top Right (High K/D, High ADR) - Green tint
                  ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
                  ctx.fillRect(midX, top, right - midX, midY - top);

                  // Bottom Left (Low K/D, Low ADR) - Red tint
                  ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
                  ctx.fillRect(left, midY, midX - left, bottom - midY);

                  // Bottom Right (High K/D, Low ADR) - Blue tint
                  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
                  ctx.fillRect(midX, midY, right - midX, bottom - midY);

                  ctx.restore();
                }
              }]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entry" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Entry Duel Aggression vs Success</CardTitle>
              <CardDescription className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm pt-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500"></span> 
                  High Volume & Success (Space Maker)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500/20 border border-yellow-500"></span> 
                  Low Volume, High Success (Selective)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500"></span> 
                  High Volume, Low Success (Ineffective)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500"></span> 
                  Low Volume & Success (Passive)
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bubble options={entryOptions} data={entryData} plugins={[{
                id: 'quadrants-entry',
                beforeDraw: (chart) => {
                  const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
                  const midX = x.getPixelForValue((x.max + x.min) / 2);
                  const midY = y.getPixelForValue((y.max + y.min) / 2);

                  ctx.save();
                  
                  // Top Left (Low Count, High Success) - Yellow tint
                  ctx.fillStyle = 'rgba(234, 179, 8, 0.1)';
                  ctx.fillRect(left, top, midX - left, midY - top);
                  
                  // Top Right (High Count, High Success) - Green tint
                  ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
                  ctx.fillRect(midX, top, right - midX, midY - top);

                  // Bottom Left (Low Count, Low Success) - Red tint
                  ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
                  ctx.fillRect(left, midY, midX - left, bottom - midY);

                  // Bottom Right (High Count, Low Success) - Blue tint
                  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
                  ctx.fillRect(midX, midY, right - midX, bottom - midY);

                  ctx.restore();
                }
              }]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utility" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Utility Performance</CardTitle>
              <CardDescription>Flash usage and damage output</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bar options={utilityOptions} data={utilityData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weapons" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Kill Distribution by Type</CardTitle>
              <CardDescription>Sniper vs Pistol vs Rifle/Other</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bar options={commonOptions} data={killTypeData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multikill" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Multikill Breakdown</CardTitle>
              <CardDescription>Who creates the big moments?</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bar options={commonOptions} data={multikillData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Team Stat Comparison</CardTitle>
              <CardDescription>Comparing average performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Radar options={radarOptions} data={radarData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clutch" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Clutch Situations & Wins</CardTitle>
              <CardDescription>1v1 and 1v2 Performance</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bar options={commonOptions} data={clutchData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="level" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>FACEIT Level vs Performance</CardTitle>
              <CardDescription>Players sorted by Level (Left to Right). Bar height = K/D.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Bar options={levelBarOptions} data={levelBarData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
