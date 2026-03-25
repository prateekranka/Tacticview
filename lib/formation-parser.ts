import type { FormationPosition, LineupPlayer } from './types';
import { PITCH_WIDTH, PITCH_HEIGHT, FORMATION_MAP } from './constants';

// Home team in TOP half: GK at top (y~85), attackers toward centre (y~485)
// Away team in BOTTOM half: GK at bottom (y~965), attackers toward centre (y~565)

/**
 * Parse a formation string like "4-3-3" into row counts including GK.
 * Returns e.g. [1, 4, 3, 3].
 */
export function parseFormationRows(formation: string): number[] {
  // Check the lookup table first
  const mapped = FORMATION_MAP[formation];
  if (mapped) return mapped;

  // Generic parse: split by "-" and prepend 1 for GK
  const parts = formation.split('-').map(Number);
  if (parts.some((n) => isNaN(n) || n <= 0)) {
    return [];
  }
  return [1, ...parts];
}

/**
 * Convert a formation string + optional player list into positioned coordinates
 * suitable for rendering on a pitch SVG.
 */
export function formationToPositions(
  formation: string | null | undefined,
  isHome: boolean,
  players?: LineupPlayer[],
  substitutedPlayerIds?: Set<number>,
): FormationPosition[] {
  if (!formation) return [];

  const rows = parseFormationRows(formation);
  if (rows.length === 0) return [];

  const totalRows = rows.length;
  const positions: FormationPosition[] = [];
  let playerIdx = 0;

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const playersInRow = rows[rowIndex];

    for (let j = 0; j < playersInRow; j++) {
      // X: evenly spaced across the pitch width
      const x = 80 + ((j + 1) * 520) / (playersInRow + 1);

      // Y: spread across the team's half
      let y: number;
      if (totalRows === 1) {
        y = isHome ? 85 : 965;
      } else if (isHome) {
        // Home: top half, GK at y=85, attackers at y=485
        y = 85 + (rowIndex / (totalRows - 1)) * 400;
      } else {
        // Away: bottom half, GK at y=965, attackers at y=565
        y = 965 - (rowIndex / (totalRows - 1)) * 400;
      }

      const player = players?.[playerIdx];
      const isSubstituted =
        player && substitutedPlayerIds
          ? substitutedPlayerIds.has(player.id)
          : false;

      positions.push({
        x,
        y,
        player: player ?? undefined,
        rowIndex,
        playerIndex: j,
        isSubstituted,
      });

      playerIdx++;
    }
  }

  return positions;
}
