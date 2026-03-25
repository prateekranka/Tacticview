export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'AWARDED';

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
  winner: Team | null;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  area: Area;
  currentSeason: Season | null;
  numberOfAvailableSeasons?: number;
  lastUpdated?: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  formation?: string;
}

export interface LineupPlayer {
  id: number;
  name: string;
  position: string | null;
  shirtNumber: number | null;
}

export interface Lineup {
  formation: string | null;
  startingXI: LineupPlayer[];
  bench: LineupPlayer[];
}

export interface MatchScore {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface Goal {
  minute: number;
  injuryTime: number | null;
  type: 'REGULAR' | 'OWN' | 'PENALTY';
  team: { id: number; name: string };
  scorer: { id: number; name: string };
  assist: { id: number; name: string } | null;
}

export interface Booking {
  minute: number;
  team: { id: number; name: string };
  player: { id: number; name: string };
  card: 'YELLOW' | 'YELLOW_RED' | 'RED';
}

export interface Substitution {
  minute: number;
  team: { id: number; name: string };
  playerOut: { id: number; name: string };
  playerIn: { id: number; name: string };
}

export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  minute?: number;
  injuryTime?: number;
  attendance?: number;
  competition: {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  };
  season: Season;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  goals: Goal[];
  bookings: Booking[];
  substitutions: Substitution[];
  lineups?: {
    homeTeam: Lineup;
    awayTeam: Lineup;
  };
  referees: Referee[];
}

export interface FormationPosition {
  x: number;
  y: number;
  player?: LineupPlayer;
  rowIndex: number;
  playerIndex: number;
  isSubstituted?: boolean;
}

export interface TacticalAnalysis {
  text: string;
  matchId: number;
  timestamp: number;
  trigger: string;
  eventsHash: string;
}

export interface StandingEntry {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string | null;
}

export interface StandingsTable {
  stage: string;
  type: string;
  group: string | null;
  table: StandingEntry[];
}

export interface StandingsResponse {
  competition: Competition;
  season: Season;
  standings: StandingsTable[];
}

export interface CompetitionsResponse {
  count: number;
  competitions: Competition[];
}

export interface MatchesResponse {
  count: number;
  matches: Match[];
}

export interface MatchResponse {
  match: Match;
}
