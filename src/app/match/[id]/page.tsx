import { getMatchStats, getMatchDetails } from "@/lib/api";
import { HeaderCard } from "@/components/dashboard/header-card";
import { MatchAnalytics } from "@/components/dashboard/match-analytics";
import { PlayerBadges } from "@/components/dashboard/player-badges";
import { TeamComparison } from "@/components/dashboard/team-comparison";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

interface MatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const [stats, details] = await Promise.all([
      getMatchStats(id),
      getMatchDetails(id),
    ]);

    const matchData = stats.rounds[0];
    const teamA = matchData?.teams[0]?.team_stats.Team || "Team A";
    const teamB = matchData?.teams[1]?.team_stats.Team || "Team B";
    const map = details.voting.map.pick[0] || "Map";
    const score = matchData?.round_stats.Score || "0 / 0";

    return {
      title: `${teamA} vs ${teamB} - ${score} (${map})`,
      description: `Detailed match statistics for ${teamA} vs ${teamB} on ${map}. Player ratings, impact analysis, and more.`,
    };
  } catch (error) {
    return {
      title: "Match Not Found",
      description: "Could not fetch match details.",
    };
  }
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  
  try {
    // Fetch both stats and details
    const [stats, details] = await Promise.all([
      getMatchStats(id),
      getMatchDetails(id),
    ]);
    
    // Assuming single map or aggregating logic for now, taking the first map/round set
    const matchData = stats.rounds[0];
    if (!matchData) {
      throw new Error("No match data found");
    }

    const teamA = matchData.teams[0];
    const teamB = matchData.teams[1];
    
    // Calculate scores from round history or use the final score if available.
    const scoreParts = matchData.round_stats.Score.split(" / ");
    const teamAScore = parseInt(scoreParts[0]);
    const teamBScore = parseInt(scoreParts[1]);

    // Create player avatars map, team map, and level map from details
    const playerAvatars = new Map<string, string>();
    const playerTeams = new Map<string, string>();
    const playerLevels = new Map<string, number>();
    
    details.teams.faction1.roster.forEach(p => {
      playerAvatars.set(p.player_id, p.avatar);
      playerTeams.set(p.player_id, details.teams.faction1.name);
      playerLevels.set(p.player_id, p.game_skill_level);
    });
    
    details.teams.faction2.roster.forEach(p => {
      playerAvatars.set(p.player_id, p.avatar);
      playerTeams.set(p.player_id, details.teams.faction2.name);
      playerLevels.set(p.player_id, p.game_skill_level);
    });

    // Combine players for charts and attach avatars, team names, and levels
    const allPlayers = [...teamA.players, ...teamB.players].map(player => ({
      ...player,
      avatar: playerAvatars.get(player.player_id) || "",
      game_skill_level: playerLevels.get(player.player_id),
      player_stats: {
        ...player.player_stats,
        Team: playerTeams.get(player.player_id) || player.player_stats.Team || "Unknown"
      }
    }));
    const totalRounds = parseInt(matchData.round_stats.Rounds);

    // Get map image
    const mapPick = details.voting.map.pick[0];
    const mapEntity = details.voting.map.entities.find(m => m.game_map_id === mapPick);
    const mapImage = mapEntity?.image_lg || "";

    // Get server location
    const locationPick = details.voting.location.pick[0];
    const locationEntity = details.voting.location.entities.find(l => l.name === locationPick);
    const serverLocation = locationPick || "Unknown";
    const serverLocationImage = locationEntity?.image_sm || "";

    // Get team avatars
    const teamAAvatar = details.teams.faction1.avatar;
    const teamBAvatar = details.teams.faction2.avatar;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-faceit-orange hover:bg-slate-900 cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
            
            <Link href={`https://www.faceit.com/en/cs2/room/${id}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-faceit-orange text-faceit-orange hover:bg-faceit-orange hover:text-white cursor-pointer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on FACEIT
              </Button>
            </Link>
          </div>

          {/* Header */}
          <HeaderCard 
            roundStats={matchData.round_stats} 
            teamA={teamA} 
            teamB={teamB} 
            teamAScore={teamAScore} 
            teamBScore={teamBScore}
            mapImage={mapImage}
            serverLocation={serverLocation}
            serverLocationImage={serverLocationImage}
            teamAAvatar={teamAAvatar}
            teamBAvatar={teamBAvatar}
          />

          {/* Match Statistics Table */}
          <div className="space-y-4">
            <PlayerBadges 
              players={allPlayers} 
              totalRounds={totalRounds} 
              teams={details.teams}
              map={details.voting.map.entities.find(m => m.game_map_id === details.voting.map.pick[0])}
              location={details.voting.location.entities.find(l => l.name === details.voting.location.pick[0])}
            />
          </div>

          {/* Main Charts Grid */}
          <div className="space-y-8">
            <TeamComparison teamA={teamA} teamB={teamB} players={allPlayers} />
            <MatchAnalytics players={allPlayers} teams={details.teams} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Error Loading Match</h1>
          <p className="text-slate-400">
            {(error as Error).message || "Could not fetch match data. Please check the ID and try again."}
          </p>
          <Link href="/">
            <Button className="bg-faceit-orange hover:bg-orange-600 text-white">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
