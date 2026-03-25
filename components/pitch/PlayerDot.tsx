import type { LineupPlayer } from '@/lib/types';

interface PlayerDotProps {
  x: number;
  y: number;
  isHome: boolean;
  player?: LineupPlayer;
  isSubstituted?: boolean;
}

function getSurname(name: string): string {
  const parts = name.trim().split(/\s+/);
  const surname = parts[parts.length - 1];
  if (surname.length > 8) {
    return surname.slice(0, 7) + '.';
  }
  return surname;
}

export default function PlayerDot({ x, y, isHome, player, isSubstituted }: PlayerDotProps) {
  const fill = isHome ? '#3b82f6' : '#ef4444';
  const opacity = isSubstituted ? 0.4 : 1;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <circle r={14} fill={fill} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      {player?.shirtNumber != null && (
        <text
          y={1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={10}
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {player.shirtNumber}
        </text>
      )}
      {player?.name && (
        <text
          y={24}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={9}
          style={{ pointerEvents: 'none' }}
        >
          {getSurname(player.name)}
        </text>
      )}
    </g>
  );
}
