"use client";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/lib/types";
import { useMemo } from "react";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ImpactMatrixProps {
  players: Player[];
  totalRounds: number;
}

export function ImpactMatrix({ players, totalRounds }: ImpactMatrixProps) {
  const data = useMemo<ChartData<"scatter">>(() => {
    const points = players.map((player) => {
      const kills = parseFloat(player.player_stats.Kills);
      const deaths = parseFloat(player.player_stats.Deaths);
      
      const survival = (totalRounds - deaths) / totalRounds;
      const impact = kills / totalRounds;

      return {
        x: parseFloat(survival.toFixed(2)),
        y: parseFloat(impact.toFixed(2)),
        player: player // Store full player object for tooltip
      };
    });

    return {
      datasets: [
        {
          label: 'Players',
          data: points,
          backgroundColor: '#FF5500',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [players, totalRounds]);

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#1e293b',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const point = context.raw as any;
            const p = point.player as Player;
            return `${p.nickname} (Survival: ${point.x}, Impact: ${point.y}, K/D: ${p.player_stats["K/D Ratio"]})`;
          }
        }
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Survival Rate',
          color: '#94a3b8'
        },
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
      y: {
        title: {
          display: true,
          text: 'Impact (KPR)',
          color: '#94a3b8'
        },
        grid: {
          color: '#334155',
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
        <CardTitle className="text-slate-100">Impact Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <Scatter options={options} data={data} plugins={[{
            id: 'quadrants',
            beforeDraw: (chart) => {
              const { ctx, chartArea: { left, top, right, bottom }, scales: { x, y } } = chart;
              const midX = x.getPixelForValue((x.max + x.min) / 2);
              const midY = y.getPixelForValue((y.max + y.min) / 2);

              ctx.save();
              
              // Top Left (Low Survival, High Impact) - Yellow tint
              ctx.fillStyle = 'rgba(234, 179, 8, 0.1)';
              ctx.fillRect(left, top, midX - left, midY - top);
              
              // Top Right (High Survival, High Impact) - Green tint
              ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
              ctx.fillRect(midX, top, right - midX, midY - top);

              // Bottom Left (Low Survival, Low Impact) - Red tint
              ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
              ctx.fillRect(left, midY, midX - left, bottom - midY);

              // Bottom Right (High Survival, Low Impact) - Blue tint
              ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
              ctx.fillRect(midX, midY, right - midX, bottom - midY);

              ctx.restore();
            }
          }]} />
        </div>
      </CardContent>
    </Card>
  );
}
