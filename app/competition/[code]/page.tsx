'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { useState } from 'react';
import { COMPETITIONS } from '@/lib/constants';
import { StandingsResponse, MatchesResponse } from '@/lib/types';
import MatchCard from '@/components/competition/MatchCard';
import StandingsTableComponent from '@/components/competition/StandingsTable';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorState from '@/components/ui/ErrorState';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

const CUP_COMPETITIONS = ['WC', 'EC', 'CL'];

export default function CompetitionPage() {
  const params = useParams();
  const code = (params?.code as string) ?? '';
  const [activeTab, setActiveTab] = useState<'matches' | 'standings'>('matches');

  const today = new Date();
  const dateFrom = formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
  const dateTo = formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));

  const {
    data: standingsData,
    error: standingsError,
    isLoading: standingsLoading,
    mutate: retryStandings,
  } = useSWR<StandingsResponse>(
    code ? `/api/standings/${code}` : null,
    fetcher
  );

  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
    mutate: retryMatches,
  } = useSWR<MatchesResponse>(
    code ? `/api/matches?competitions=${code}&dateFrom=${dateFrom}&dateTo=${dateTo}` : null,
    fetcher
  );

  const competition = COMPETITIONS.find((c) => c.code === code);
  const competitionName =
    competition?.name ??
    standingsData?.competition?.name ??
    code;

  const isCup = CUP_COMPETITIONS.includes(code.toUpperCase());

  const matches = matchesData?.matches ?? [];

  // Group matches by date
  const matchesByDate = matches.reduce<Record<string, typeof matches>>((acc, match) => {
    const date = match.utcDate ? match.utcDate.split('T')[0] : 'Unknown';
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {});

  const sortedDates = Object.keys(matchesByDate).sort();

  function formatDisplayDate(dateStr: string): string {
    if (dateStr === 'Unknown') return 'Unknown Date';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-tv-bg text-tv-text">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-tv-text-muted hover:text-tv-text transition-colors mb-6 text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-tv-text flex items-center gap-3">
            {competition?.flag && (
              <span className="text-3xl" aria-hidden="true">
                {competition.flag}
              </span>
            )}
            {competitionName}
          </h1>
          {competition?.description && (
            <p className="text-tv-text-muted text-sm mt-1">{competition.description}</p>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-6 bg-tv-surface rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'matches'
                ? 'bg-tv-surface-hover text-tv-text'
                : 'text-tv-text-muted hover:text-tv-text'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'standings'
                ? 'bg-tv-surface-hover text-tv-text'
                : 'text-tv-text-muted hover:text-tv-text'
            }`}
          >
            Standings
          </button>
        </div>

        {/* Matches tab */}
        {activeTab === 'matches' && (
          <div>
            {matchesLoading && (
              <div className="space-y-3">
                <LoadingSkeleton lines={3} />
                <LoadingSkeleton lines={3} />
                <LoadingSkeleton lines={3} />
              </div>
            )}

            {!matchesLoading && matchesError && (
              <ErrorState
                message="Failed to load matches."
                onRetry={() => retryMatches()}
              />
            )}

            {!matchesLoading && !matchesError && matches.length === 0 && (
              <div className="text-center py-12 text-tv-text-muted">
                <p className="text-lg">No matches found</p>
                <p className="text-sm mt-1">
                  No matches scheduled in the ±7 day window.
                </p>
              </div>
            )}

            {!matchesLoading && !matchesError && sortedDates.length > 0 && (
              <div className="space-y-6">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <h2 className="text-xs font-semibold text-tv-text-muted uppercase tracking-wider mb-3 px-1">
                      {formatDisplayDate(date)}
                    </h2>
                    <div className="space-y-2">
                      {matchesByDate[date].map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Standings tab */}
        {activeTab === 'standings' && (
          <div>
            {isCup ? (
              <div className="text-center py-12 text-tv-text-muted bg-tv-surface rounded-lg border border-tv-border">
                <p className="text-lg font-medium text-tv-text">Standings not available</p>
                <p className="text-sm mt-1">
                  Standings are not available for cup competitions.
                </p>
              </div>
            ) : (
              <>
                {standingsLoading && (
                  <div className="space-y-2">
                    <LoadingSkeleton lines={5} />
                  </div>
                )}

                {!standingsLoading && standingsError && (
                  <ErrorState
                    message="Failed to load standings."
                    onRetry={() => retryStandings()}
                  />
                )}

                {!standingsLoading && !standingsError && standingsData?.standings && (
                  <StandingsTableComponent standings={standingsData.standings} />
                )}

                {!standingsLoading && !standingsError && !standingsData?.standings && (
                  <div className="text-center py-12 text-tv-text-muted">
                    <p>No standings data available.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
