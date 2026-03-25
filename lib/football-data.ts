import type {
  CompetitionsResponse,
  MatchesResponse,
  MatchResponse,
  StandingsResponse,
} from './types';

// ---------------------------------------------------------------------------
// Rate limiting – token bucket (10 requests / minute)
// ---------------------------------------------------------------------------

let tokens = 10;
let lastRefill = Date.now();

async function acquireToken(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRefill;
  const refillAmount = (elapsed / 60_000) * 10; // 10 tokens per minute
  tokens = Math.min(10, tokens + refillAmount);
  lastRefill = now;

  if (tokens < 1) {
    const waitMs = ((1 - tokens) / 10) * 60_000;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    tokens = 1;
    lastRefill = Date.now();
  }

  tokens -= 1;
}

// ---------------------------------------------------------------------------
// Caching
// ---------------------------------------------------------------------------

const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttl: number): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

function getTTL(status?: string): number {
  if (status === 'IN_PLAY') return 60_000; // 1 minute for live matches
  return 300_000; // 5 minutes for everything else
}

// ---------------------------------------------------------------------------
// Base fetch helper
// ---------------------------------------------------------------------------

const BASE_URL = 'https://api.football-data.org/v4';

async function footballFetch<T>(
  path: string,
  cacheKey: string,
  ttl?: number,
): Promise<T> {
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  await acquireToken();

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY is not configured');
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'X-Auth-Token': apiKey,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`football-data.org API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  setCache(cacheKey, data, ttl ?? 300_000);
  return data;
}

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

export async function getCompetitions(): Promise<CompetitionsResponse> {
  return footballFetch<CompetitionsResponse>(
    '/competitions',
    'competitions',
    300_000,
  );
}

export async function getMatches(params?: {
  competitions?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}): Promise<MatchesResponse> {
  const searchParams = new URLSearchParams();
  if (params?.competitions) searchParams.set('competitions', params.competitions);
  if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
  if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
  if (params?.status) searchParams.set('status', params.status);

  const qs = searchParams.toString();
  const path = `/matches${qs ? `?${qs}` : ''}`;
  const cacheKey = `matches:${qs}`;
  const ttl = params?.status === 'IN_PLAY' ? getTTL('IN_PLAY') : getTTL();

  return footballFetch<MatchesResponse>(path, cacheKey, ttl);
}

export async function getMatch(id: number): Promise<MatchResponse> {
  return footballFetch<MatchResponse>(
    `/matches/${id}`,
    `match:${id}`,
    60_000, // 60s TTL for individual match (may be live)
  );
}

export async function getStandings(
  competitionCode: string,
): Promise<StandingsResponse> {
  return footballFetch<StandingsResponse>(
    `/competitions/${competitionCode}/standings`,
    `standings:${competitionCode}`,
    300_000,
  );
}

export async function getTodayMatches(): Promise<MatchesResponse> {
  // Use IST (UTC+5:30) to determine "today"
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const dateStr = istDate.toISOString().slice(0, 10);

  return getMatches({
    dateFrom: dateStr,
    dateTo: dateStr,
  });
}
