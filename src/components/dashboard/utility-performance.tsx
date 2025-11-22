"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UtilityPerformanceProps {
  players: Player[];
}

export function UtilityPerformance({ players }: UtilityPerformanceProps) {
  // Sort by Utility Damage
  const sortedPlayers = [...players]
    .sort((a, b) => parseFloat(b.player_stats["Utility Damage"]) - parseFloat(a.player_stats["Utility Damage"]));

  const data: ChartData<"bar"> = {
    labels: sortedPlayers.map(p => p.nickname),
    datasets: [
      {
        label: 'Utility Damage',
        data: sortedPlayers.map(p => parseFloat(p.player_stats["Utility Damage"])),
        backgroundColor: '#FF5500',
      },
      {
        label: 'Flash Successes',
        data: sortedPlayers.map(p => parseFloat(p.player_stats["Flash Successes"])),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#1e293b',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: '#334155',
        },
        ticks: {
          color: '#94a3b8',
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8',
        },
        border: {
          display: false
        }
      }
    },
  };

  return (
    <Card className="w-full bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100">Utility Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Bar options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
