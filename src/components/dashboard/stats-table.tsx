import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StatsTableProps {
  players: Player[];
}

export function StatsTable({ players }: StatsTableProps) {
  // Sort by Kills by default
  const sortedPlayers = [...players].sort((a, b) => parseInt(b.player_stats.Kills) - parseInt(a.player_stats.Kills));

  return (
    <Card className="w-full bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100">Detailed Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400 w-[150px]">Player</TableHead>
              <TableHead className="text-slate-400 text-right">Kills</TableHead>
              <TableHead className="text-slate-400 text-right">Assists</TableHead>
              <TableHead className="text-slate-400 text-right">Deaths</TableHead>
              <TableHead className="text-slate-400 text-right font-bold text-faceit-orange">K/D</TableHead>
              <TableHead className="text-slate-400 text-right">K/R</TableHead>
              <TableHead className="text-slate-400 text-right">ADR</TableHead>
              <TableHead className="text-slate-400 text-right">HS %</TableHead>
              <TableHead className="text-slate-400 text-right" title="Entry Wins / Attempts">Entry (W/A)</TableHead>
              <TableHead className="text-slate-400 text-right" title="Utility Damage">Util Dmg</TableHead>
              <TableHead className="text-slate-400 text-right" title="Enemies Flashed">Flashed</TableHead>
              <TableHead className="text-slate-400 text-right">1v1</TableHead>
              <TableHead className="text-slate-400 text-right">1v2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player) => (
              <TableRow key={player.player_id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar} alt={player.nickname} />
                      <AvatarFallback>{player.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{player.nickname}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats.Kills}</TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats.Assists}</TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats.Deaths}</TableCell>
                <TableCell className={`text-right font-bold ${parseFloat(player.player_stats["K/D Ratio"]) >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {player.player_stats["K/D Ratio"]}
                </TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats["K/R Ratio"]}</TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats.ADR}</TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats["Headshots %"]}%</TableCell>
                <TableCell className="text-right text-slate-300">
                  {player.player_stats["Entry Wins"]}/{player.player_stats["Entry Count"]}
                </TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats["Utility Damage"]}</TableCell>
                <TableCell className="text-right text-slate-300">{player.player_stats["Enemies Flashed"]}</TableCell>
                <TableCell className="text-right text-slate-300">
                  {player.player_stats["1v1Wins"]}/{player.player_stats["1v1Count"]}
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {player.player_stats["1v2Wins"]}/{player.player_stats["1v2Count"]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
