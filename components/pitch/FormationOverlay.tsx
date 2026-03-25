import type { LineupPlayer, Substitution } from '@/lib/types';
import { formationToPositions } from '@/lib/formation-parser';
import PlayerDot from './PlayerDot';

interface FormationOverlayProps {
  formation?: string | null;
  isHome: boolean;
  players?: LineupPlayer[];
  substitutions?: Substitution[];
  label?: string;
}

export default function FormationOverlay({
  formation,
  isHome,
  players,
  substitutions,
  label,
}: FormationOverlayProps) {
  if (!formation || !players || players.length === 0) {
    return (
      <text
        x={340}
        y={isHome ? 260 : 790}
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize={14}
      >
        No lineup available
      </text>
    );
  }

  const substitutedPlayerIds = new Set(
    (substitutions ?? [])
      .filter((s) => {
        // Only consider subs for this team's players
        return players.some((p) => p.id === s.playerOut.id);
      })
      .map((s) => s.playerOut.id),
  );

  const positions = formationToPositions(formation, isHome, players, substitutedPlayerIds);

  // Label position: near own goal
  const labelY = isHome ? 60 : 990;

  return (
    <>
      {label && (
        <text
          x={340}
          y={labelY}
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize={12}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
      {positions.map((pos, i) => (
        <PlayerDot
          key={i}
          x={pos.x}
          y={pos.y}
          isHome={isHome}
          player={pos.player}
          isSubstituted={pos.isSubstituted}
        />
      ))}
    </>
  );
}
