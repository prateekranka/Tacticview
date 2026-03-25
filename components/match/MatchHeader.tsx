'use client';

import { useState } from 'react';
import type { Match } from '@/lib/types';
import Badge from '@/components/ui/Badge';

interface MatchHeaderProps {
  match: Match;
}

function TeamCrest({ crest, tla, className = '' }: { crest: string; tla: string; className?: string }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !crest) {
    return (
      <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-tv-surface-hover text-xs font-bold text-tv-text ${className}`}>
        {tla}
      </span>
    );
  }

  return (
    <img
      src={crest}
      alt={tla}
      className={`h-10 w-10 object-contain ${className}`}
      onError={() => setImgError(true)}
    />
  );
}

export default function MatchHeader({ match }: MatchHeaderProps) {
  const { homeTeam, awayTeam, score, competition, matchday, status, minute, injuryTime, lastUpdated } = match;

  const homeScore = score.fullTime.home;
  const awayScore = score.fullTime.away;
  const showScore = homeScore !== null && awayScore !== null;

  const lastUpdatedStr = new Date(lastUpdated).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-lg border border-tv-border bg-tv-surface p-4 sm:p-6">
      {/* Competition info */}
      <div className="mb-4 text-center">
        <p className="text-xs text-tv-text-muted">
          {competition.name}
          {matchday != null && ` \u2022 Matchday ${matchday}`}
        </p>
      </div>

      {/* Score display */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Home team */}
        <div className="flex flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-end">
          <span className="order-2 text-center text-sm font-bold text-tv-text sm:order-1 sm:text-base">
            {homeTeam.shortName}
          </span>
          <TeamCrest crest={homeTeam.crest} tla={homeTeam.tla} className="order-1 sm:order-2" />
        </div>

        {/* Score / Status */}
        <div className="flex flex-col items-center gap-1 px-2 sm:px-4">
          {showScore ? (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-tv-text sm:text-4xl">{homeScore}</span>
              <span className="text-xl text-tv-text-muted">-</span>
              <span className="text-3xl font-bold text-tv-text sm:text-4xl">{awayScore}</span>
            </div>
          ) : (
            <span className="text-lg text-tv-text-muted">vs</span>
          )}
          <Badge status={status} minute={minute} injuryTime={injuryTime} />
        </div>

        {/* Away team */}
        <div className="flex flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-start">
          <TeamCrest crest={awayTeam.crest} tla={awayTeam.tla} />
          <span className="text-center text-sm font-bold text-tv-text sm:text-base">
            {awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Last updated */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-tv-text-muted">Last updated: {lastUpdatedStr} IST</p>
      </div>
    </div>
  );
}
