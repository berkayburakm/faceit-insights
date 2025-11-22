import { FaceitMatchStats, FaceitMatchDetails } from "./types";

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
