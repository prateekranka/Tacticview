'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Match, MatchStatus } from '@/lib/types';

interface MatchCardProps {
  match: Match;
}

function formatIST(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function StatusBadge({ status, minute, injuryTime }: { status: MatchStatus; minute?: number; injuryTime?: number }) {
  if (status === 'IN_PLAY' || status === 'PAUSED') {
    const label =
      status === 'PAUSED'
        ? 'HT'
        : minute != null
        ? injuryTime
          ? `${minute}+${injuryTime}'`
          : `${minute}'`
        : 'LIVE';
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-tv-live/15 px-2 py-0.5 text-xs font-semibold text-tv-live">
        <span className="h-1.5 w-1.5 rounded-full bg-tv-live animate-pulse" />
        {label}
      </span>
    );
  }

  if (status === 'FINISHED') {
    return (
      <span className="inline-flex items-center rounded-full bg-tv-border/60 px-2 py-0.5 text-xs font-medium text-tv-text-muted">
        FT
      </span>
    );
  }

  if (status === 'POSTPONED') {
    return (
      <span className="inline-flex items-center rounded-full bg-tv-goal/15 px-2 py-0.5 text-xs font-semibold text-tv-goal">
        PPD
      </span>
    );
  }

  if (status === 'CANCELLED' || status === 'SUSPENDED') {
    return (
      <span className="inline-flex items-center rounded-full bg-tv-live/10 px-2 py-0.5 text-xs font-medium text-tv-live/80">
        {status === 'CANCELLED' ? 'CANC' : 'SUSP'}
      </span>
    );
  }

  // SCHEDULED / TIMED / AWARDED — show time
  return null;
}

function TeamCrest({ src, tla, name }: { src: string; tla: string; name: string }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tv-surface-hover text-xs font-bold text-tv-text-muted">
        {tla.slice(0, 3)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={32}
      height={32}
      className="h-8 w-8 object-contain"
      onError={() => setImgError(true)}
    />
  );
}

export default function MatchCard({ match }: MatchCardProps) {
  const { homeTeam, awayTeam, score, status, utcDate, minute, injuryTime } = match;

  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  const hasScore =
    score.fullTime.home !== null && score.fullTime.away !== null;
  const homeGoals = hasScore ? score.fullTime.home : null;
  const awayGoals = hasScore ? score.fullTime.away : null;

  const homeWin = score.winner === 'HOME_TEAM';
  const awayWin = score.winner === 'AWAY_TEAM';

  return (
    <Link
      href={`/match/${match.id}`}
      className="group block rounded-xl border border-tv-border bg-tv-surface transition-colors hover:border-tv-accent/40 hover:bg-tv-surface-hover"
    >
      <div className="flex flex-col gap-3 p-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} minute={minute} injuryTime={injuryTime} />
          <span className="text-xs text-tv-text-muted">
            {isLive ? null : formatIST(utcDate)}
          </span>
        </div>

        {/* Teams + score */}
        <div className="flex items-center gap-3">
          {/* Home team */}
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <TeamCrest src={homeTeam.crest} tla={homeTeam.tla} name={homeTeam.name} />
            <span
              className={`truncate text-sm font-medium ${
                homeWin ? 'text-tv-text' : hasScore && !homeWin ? 'text-tv-text-muted' : 'text-tv-text'
              }`}
            >
              {homeTeam.shortName || homeTeam.tla}
            </span>
          </div>

          {/* Score / vs */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-tv-surface-hover px-3 py-1.5">
            {hasScore ? (
              <>
                <span
                  className={`text-base font-bold tabular-nums ${
                    homeWin ? 'text-tv-text' : 'text-tv-text-muted'
                  }`}
                >
                  {homeGoals}
                </span>
                <span className="text-xs text-tv-border">–</span>
                <span
                  className={`text-base font-bold tabular-nums ${
                    awayWin ? 'text-tv-text' : 'text-tv-text-muted'
                  }`}
                >
                  {awayGoals}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-tv-text-muted">vs</span>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
            <span
              className={`truncate text-sm font-medium text-right ${
                awayWin ? 'text-tv-text' : hasScore && !awayWin ? 'text-tv-text-muted' : 'text-tv-text'
              }`}
            >
              {awayTeam.shortName || awayTeam.tla}
            </span>
            <TeamCrest src={awayTeam.crest} tla={awayTeam.tla} name={awayTeam.name} />
          </div>
        </div>

        {/* IST time shown below for live matches */}
        {isLive && (
          <p className="text-right text-xs text-tv-text-muted">
            {formatIST(utcDate)}
          </p>
        )}
      </div>
    </Link>
  );
}
