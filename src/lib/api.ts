import { FaceitMatchStats, FaceitMatchDetails, FaceitPlayer, MatchHistoryResponse, PlayerLifetimeStats } from "./types";

const FACEIT_API_BASE_URL = "https://open.faceit.com/data/v4";
const FACEIT_API_KEY = process.env.FACEIT_API_KEY;

export async function getMatchStats(matchId: string): Promise<FaceitMatchStats> {
  if (!FACEIT_API_KEY) {
    console.warn("FACEIT_API_KEY is not defined in environment variables.");
  }

  const url = `${FACEIT_API_BASE_URL}/matches/${matchId}/stats`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${FACEIT_API_KEY}`,
    },
    cache: 'force-cache',
  });
  
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Match not found");
    }
    throw new Error(`Failed to fetch match stats: ${res.statusText}`);
  }

  return data;
}

export async function getMatchDetails(matchId: string): Promise<FaceitMatchDetails> {
  
  const url = `${FACEIT_API_BASE_URL}/matches/${matchId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${FACEIT_API_KEY}`,
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Match not found");
    }
    throw new Error(`Failed to fetch match details: ${res.statusText}`);
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Match not found");
    }
    throw new Error(`Failed to fetch match details: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getPlayer(playerId: string): Promise<FaceitPlayer> {
  const url = `${FACEIT_API_BASE_URL}/players/${playerId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${FACEIT_API_KEY}`,
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Player not found");
    }
    throw new Error(`Failed to fetch player: ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`📦 Player data fetched for: ${playerId}`,data);
  return data;
}

export async function getPlayerByNickname(nickname: string): Promise<FaceitPlayer> {
  const url = `${FACEIT_API_BASE_URL}/players?nickname=${encodeURIComponent(nickname)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${FACEIT_API_KEY}`,
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Player not found");
    }
    throw new Error(`Failed to fetch player by nickname: ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`📦 Player data fetched for nickname: ${nickname}`);
  return data;
}

export async function getPlayerHistory(
  playerId: string, 
  game: string = "cs2", 
  offset: number = 0, 
  limit: number = 20
): Promise<MatchHistoryResponse> {
  const url = `${FACEIT_API_BASE_URL}/players/${playerId}/history?game=${game}&offset=${offset}&limit=${limit}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${FACEIT_API_KEY}`,
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Player history not found");
    }
    throw new Error(`Failed to fetch player history: ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`📦 Player history fetched for: ${playerId} (${data.items?.length || 0} matches)`);
  return data;
}

export async function getPlayerStats(playerId: string, gameId: string = "cs2"): Promise<PlayerLifetimeStats> {
  const url = `${FACEIT_API_BASE_URL}/players/${playerId}/stats/${gameId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${FACEIT_API_KEY}`,
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Player stats not found");
    }
    throw new Error(`Failed to fetch player stats: ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`📦 Player stats fetched for: ${playerId}`);
  return data;
}
