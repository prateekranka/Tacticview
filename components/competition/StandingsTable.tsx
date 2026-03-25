'use client';

import { useState } from 'react';
import type { StandingsTable as StandingsTableType, StandingEntry } from '@/lib/types';

interface StandingsTableProps {
  standings: StandingsTableType[];
}

// Returns a Tailwind color class based on league position
function positionColor(position: number): string | null {
  if (position <= 4) return 'bg-tv-accent';      // Champions League (green)
  if (position <= 6) return 'bg-tv-accent-blue'; // Europa / Conference League (blue)
  return null;
}

function positionTitle(position: number): string {
  if (position <= 4) return 'Champions League';
  if (position <= 6) return 'Europa League / Conference League';
  return '';
}

function TeamCrestCell({ src, name, shortName }: { src: string; name: string; shortName: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-2 min-w-0">
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          width={20}
          height={20}
          className="h-5 w-5 shrink-0 object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-tv-surface-hover text-[9px] font-bold text-tv-text-muted">
          {shortName.slice(0, 3).toUpperCase()}
        </span>
      )}
      <span className="truncate text-sm text-tv-text">{shortName}</span>
    </div>
  );
}

function StandingRow({ entry }: { entry: StandingEntry }) {
  const dotColor = positionColor(entry.position);
  const title = positionTitle(entry.position);
  const gdStr = entry.goalDifference > 0 ? `+${entry.goalDifference}` : String(entry.goalDifference);

  return (
    <tr className="border-b border-tv-border/50 hover:bg-tv-surface-hover/50 transition-colors">
      {/* Position */}
      <td className="w-8 py-2 pl-3 pr-1 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {dotColor ? (
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`}
              title={title}
            />
          ) : (
            <span className="h-2 w-2 shrink-0 rounded-full bg-transparent" />
          )}
          <span className="text-xs font-medium text-tv-text-muted w-4 text-right">
            {entry.position}
          </span>
        </div>
      </td>

      {/* Team */}
      <td className="py-2 pr-3 pl-1 max-w-[160px]">
        <TeamCrestCell
          src={entry.team.crest}
          name={entry.team.name}
          shortName={entry.team.shortName || entry.team.tla}
        />
      </td>

      {/* Played */}
      <td className="w-8 py-2 text-center text-xs tabular-nums text-tv-text-muted">
        {entry.playedGames}
      </td>

      {/* Won */}
      <td className="w-8 py-2 text-center text-xs tabular-nums text-tv-text-muted">
        {entry.won}
      </td>

      {/* Drawn */}
      <td className="w-8 py-2 text-center text-xs tabular-nums text-tv-text-muted">
        {entry.draw}
      </td>

      {/* Lost */}
      <td className="w-8 py-2 text-center text-xs tabular-nums text-tv-text-muted">
        {entry.lost}
      </td>

      {/* Goal difference */}
      <td
        className={`w-10 py-2 text-center text-xs tabular-nums font-medium ${
          entry.goalDifference > 0
            ? 'text-tv-accent'
            : entry.goalDifference < 0
            ? 'text-tv-live'
            : 'text-tv-text-muted'
        }`}
      >
        {gdStr}
      </td>

      {/* Points */}
      <td className="w-10 py-2 pr-3 text-center text-sm font-bold tabular-nums text-tv-text">
        {entry.points}
      </td>
    </tr>
  );
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return (
      <p className="text-sm text-tv-text-muted py-4 text-center">
        No standings available.
      </p>
    );
  }

  const table = standings[0].table;

  return (
    <div className="overflow-x-auto rounded-xl border border-tv-border bg-tv-surface">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr className="border-b border-tv-border">
            <th className="w-8 py-2.5 pl-3 pr-1 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              #
            </th>
            <th className="py-2.5 pr-3 pl-1 text-left text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              Club
            </th>
            <th className="w-8 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              MP
            </th>
            <th className="w-8 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              W
            </th>
            <th className="w-8 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              D
            </th>
            <th className="w-8 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              L
            </th>
            <th className="w-10 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              GD
            </th>
            <th className="w-10 py-2.5 pr-3 text-center text-[10px] font-semibold uppercase tracking-wider text-tv-text-muted">
              Pts
            </th>
          </tr>
        </thead>
        <tbody>
          {table.map((entry) => (
            <StandingRow key={entry.team.id} entry={entry} />
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-t border-tv-border/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-tv-accent" />
          <span className="text-[11px] text-tv-text-muted">Champions League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-tv-accent-blue" />
          <span className="text-[11px] text-tv-text-muted">Europa / Conference</span>
        </div>
      </div>
    </div>
  );
}
