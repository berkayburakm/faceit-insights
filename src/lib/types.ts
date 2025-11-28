export interface FaceitMatchStats {
  rounds: Round[];
}


export interface Player {
  player_id: string;
  nickname: string;
  avatar?: string;
  game_skill_level?: number;
  player_stats: PlayerStats;
}

export interface PlayerStats {
  Kills: string;
  Deaths: string;
  Assists: string;
  "Headshots %": string;
  "K/R Ratio": string;
  "K/D Ratio": string;
  "Quadro Kills": string;
  "Penta Kills": string;
  "Triple Kills": string;
  "Double Kills": string;
  Result: string;
  MVPs: string;
  ADR: string;
  "Utility Damage": string;
  "Utility Enemies": string;
  "Utility Count": string;
  "Utility Successes": string;
  "Utility Usage per Round": string;
  "Utility Damage per Round in a Match": string;
  "Utility Success Rate per Match": string;
  "Flash Count": string;
  "Flash Successes": string;
  "Flashes per Round in a Match": string;
  "Flash Success Rate per Match": string;
  "Enemies Flashed": string;
  "Enemies Flashed per Round in a Match": string;
  "Entry Count": string;
  "Entry Wins": string;
  "Match Entry Rate": string;
  "Match Entry Success Rate": string;
  "First Kills": string;
  "Clutch Kills": string;
  "1v1Count": string;
  "1v1Wins": string;
  "1v2Count": string;
  "1v2Wins": string;
  "Sniper Kills": string;
  "Sniper Kill Rate per Match": string;
  "Sniper Kill Rate per Round": string;
  "Pistol Kills": string;
  "Zeus Kills": string;
  "Knife Kills": string;
  Damage: string;
  [key: string]: string;
}

export interface FaceitMatchDetails {
  match_id: string;
  teams: {
    faction1: Faction;
    faction2: Faction;
  };
  voting: {
    map: {
      pick: string[];
      entities: MapEntity[];
    };
    location: {
      pick: string[];
      entities: LocationEntity[];
    };
  };
  results: {
    winner: string;
    score: {
      faction1: number;
      faction2: number;
    };
  };
}

export interface Faction {
  faction_id: string;
  name: string;
  avatar: string;
  roster: RosterPlayer[];
}

export interface RosterPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  game_skill_level: number;
}

export interface MapEntity {
  game_map_id: string;
  name: string;
  image_lg: string;
  image_sm: string;
}

export interface LocationEntity {
  name: string;
  image_lg: string;
  image_sm: string;
}

export interface Round {
  best_of: string;
  competition_id: string;
  game_id: string;
  game_mode: string;
  match_id: string;
  match_round: string;
  played: string;
  round_stats: RoundStats;
  teams: Team[];
}

export interface RoundStats {
  Winner: string;
  Score: string;
  Map: string;
  Rounds: string;
  Region: string;
}

export interface Team {
  team_id: string;
  premade: boolean;
  team_stats: TeamStats;
  players: Player[];
}

export interface TeamStats {
  Team: string;
  "Team Win": string;
  "Final Score": string;
  "First Half Score": string;
  "Second Half Score": string;
  "Team Headshots": string;
  "Overtime score": string;
}

// Player Profile Types
export interface FaceitPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  cover_image: string;
  faceit_url: string;
  games: Record<string, GameDetail>;
  memberships: string[];
  verified: boolean;
  activated_at: string;
}

export interface GameDetail {
  faceit_elo: number;
  skill_level: number;
  game_player_id: string;
  game_player_name: string;
  region: string;
}

export interface MatchHistoryResponse {
  items: MatchHistoryItem[];
  start: number;
  end: number;
}

export interface MatchHistoryItem {
  match_id: string;
  competition_id: string;
  competition_name: string;
  competition_type: string;
  finished_at: number;
  game_id: string;
  game_mode: string;
  match_type: string;
  max_players: number;
  organizer_id: string;
  playing_players: string[];
  results: MatchHistoryResults;
  started_at: number;
  status: string;
  teams: MatchHistoryTeams;
  teams_size: number;
}

export interface MatchHistoryResults {
  winner: string;
  score: Record<string, number>;
}

export interface MatchHistoryTeams {
  faction1: MatchHistoryFaction;
  faction2: MatchHistoryFaction;
}

export interface MatchHistoryFaction {
  faction_id: string;
  nickname: string;
  avatar: string;
  type: string;
  players: MatchHistoryPlayer[];
}

export interface MatchHistoryPlayer {
  player_id: string;
  nickname: string;
  avatar: string;
  skill_level: number;
  game_player_id: string;
  game_player_name: string;
  faceit_url: string;
}

export interface PlayerLifetimeStats {
  player_id: string;
  game_id: string;
  lifetime: LifetimeStats;
  segments: StatsSegment[];
}

export interface LifetimeStats {
  "K/D Ratio": string;
  "Win Rate %": string;
  Matches: string;
  "Total Headshots %": string;
  "Average K/D Ratio": string;
  "Average Headshots %": string;
  "Longest Win Streak": string;
  "Current Win Streak": string;
  Wins: string;
  "Recent Results": string[];
  [key: string]: string | string[];
}

export interface StatsSegment {
  label: string;
  img_small: string;
  img_regular: string;
  stats: SegmentStats;
  mode: string;
  type: string;
}

export interface SegmentStats {
  Kills: string;
  Deaths: string;
  Assists: string;
  "K/D Ratio": string;
  "K/R Ratio": string;
  "Headshots %": string;
  Matches: string;
  Wins: string;
  "Win Rate %": string;
  MVPs: string;
  "Triple Kills": string;
  "Quadro Kills": string;
  "Penta Kills": string;
  "Average K/D Ratio": string;
  "Average K/R Ratio": string;
  "Average Kills": string;
  "Average Deaths": string;
  "Average Assists": string;
  "Average Headshots %": string;
  "Average MVPs": string;
  "Average Triple Kills": string;
  "Average Quadro Kills": string;
  "Average Penta Kills": string;
  [key: string]: string;
}
