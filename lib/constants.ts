export const COMPETITIONS = [
  { code: 'PL', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', description: 'English top flight' },
  { code: 'PD', name: 'La Liga', country: 'Spain', flag: '🇪🇸', description: 'Spanish top flight' },
  { code: 'SA', name: 'Serie A', country: 'Italy', flag: '🇮🇹', description: 'Italian top flight' },
  { code: 'BL1', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪', description: 'German top flight' },
  { code: 'FL1', name: 'Ligue 1', country: 'France', flag: '🇫🇷', description: 'French top flight' },
  { code: 'CL', name: 'Champions League', country: 'Europe', flag: '🇪🇺', description: 'UEFA Champions League' },
  { code: 'DED', name: 'Eredivisie', country: 'Netherlands', flag: '🇳🇱', description: 'Dutch top flight' },
  { code: 'PPL', name: 'Primeira Liga', country: 'Portugal', flag: '🇵🇹', description: 'Portuguese top flight' },
  { code: 'ELC', name: 'Championship', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', description: 'English second tier' },
  { code: 'BSA', name: 'Série A', country: 'Brazil', flag: '🇧🇷', description: 'Brazilian top flight' },
  { code: 'WC', name: 'World Cup', country: 'International', flag: '🌍', description: 'FIFA World Cup' },
  { code: 'EC', name: 'European Championship', country: 'Europe', flag: '🇪🇺', description: 'UEFA European Championship' },
] as const;

export const FORMATION_MAP: Record<string, number[]> = {
  '4-4-2': [1, 4, 4, 2],
  '4-3-3': [1, 4, 3, 3],
  '4-2-3-1': [1, 4, 2, 3, 1],
  '4-1-4-1': [1, 4, 1, 4, 1],
  '4-4-1-1': [1, 4, 4, 1, 1],
  '4-3-2-1': [1, 4, 3, 2, 1],
  '4-1-2-1-2': [1, 4, 1, 2, 1, 2],
  '4-5-1': [1, 4, 5, 1],
  '3-4-3': [1, 3, 4, 3],
  '3-5-2': [1, 3, 5, 2],
  '3-4-1-2': [1, 3, 4, 1, 2],
  '3-4-2-1': [1, 3, 4, 2, 1],
  '5-3-2': [1, 5, 3, 2],
  '5-4-1': [1, 5, 4, 1],
  '5-2-3': [1, 5, 2, 3],
  '3-3-4': [1, 3, 3, 4],
  '4-2-4': [1, 4, 2, 4],
  '4-3-1-2': [1, 4, 3, 1, 2],
  '4-2-2-2': [1, 4, 2, 2, 2],
  '3-5-1-1': [1, 3, 5, 1, 1],
};

export const PITCH_WIDTH = 680;
export const PITCH_HEIGHT = 1050;
export const PLAYER_DOT_RADIUS = 14;

// Color constants matching tailwind config
export const COLORS = {
  BG: '#0a0a0a',
  SURFACE: '#171717',
  SURFACE_HOVER: '#262626',
  BORDER: '#333333',
  TEXT: '#f5f5f5',
  TEXT_MUTED: '#a3a3a3',
  ACCENT: '#22c55e',
  ACCENT_BLUE: '#3b82f6',
  LIVE: '#ef4444',
  GOAL: '#eab308',
  PITCH: '#1a6b1a',
} as const;
