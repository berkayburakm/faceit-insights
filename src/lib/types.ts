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
