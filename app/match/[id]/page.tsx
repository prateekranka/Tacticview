'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { useState, useRef, useCallback } from 'react';
import { Match } from '@/lib/types';
import MatchHeader from '@/components/match/MatchHeader';
import EventTimeline from '@/components/match/EventTimeline';
import PitchSVG from '@/components/pitch/PitchSVG';
import FormationOverlay from '@/components/pitch/FormationOverlay';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorState from '@/components/ui/ErrorState';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function getRefreshInterval(match: Match | undefined): number {
  if (!match) return 0;
  const status = match.status;
  if (status === 'IN_PLAY') return 60_000;
  if (status === 'PAUSED') return 30_000;
  return 0;
}

function eventsHash(match: Match): string {
  return `${match.goals?.length ?? 0}-${match.bookings?.length ?? 0}-${match.substitutions?.length ?? 0}`;
}

export default function MatchPage() {
  const params = useParams();
  const id = (params?.id as string) ?? '';

  const {
    data,
    error,
    isLoading,
    mutate: retryMatch,
  } = useSWR<{ match: Match }>(
    id ? `/api/match/${id}` : null,
    fetcher,
    {
      refreshInterval: (latestData) => getRefreshInterval(latestData?.match),
    }
  );

  const match = data?.match;

  // Tactical analysis state
  const [analysisText, setAnalysisText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [cachedHash, setCachedHash] = useState('');
  const [showRefreshPrompt, setShowRefreshPrompt] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentHash = match ? eventsHash(match) : '';

  const startAnalysis = useCallback(async (matchData: Match) => {
    // Cancel any in-progress stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsStreaming(true);
    setAnalysisText('');
    setAnalysisError('');
    setShowRefreshPrompt(false);

    try {
      const response = await fetch('/api/tactical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match: matchData, trigger: 'manual' }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === 'content') {
              setAnalysisText((prev) => prev + (event.text ?? ''));
            } else if (event.type === 'done') {
              setIsStreaming(false);
              setCachedHash(eventsHash(matchData));
              abortControllerRef.current = null;
              return;
            } else if (event.type === 'error') {
              throw new Error(event.message ?? 'Unknown streaming error');
            }
          } catch (parseErr) {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Intentionally aborted, don't update error state
        return;
      }
      setAnalysisError(
        err instanceof Error ? err.message : 'Failed to load analysis'
      );
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const handleGetAnalysis = () => {
    if (!match) return;
    startAnalysis(match);
  };

  const handleRefreshAnalysis = () => {
    if (!match) return;
    setShowRefreshPrompt(false);
    startAnalysis(match);
  };

  // Detect if events changed after analysis was cached
  const hasNewEvents =
    analysisText.length > 0 &&
    cachedHash !== '' &&
    currentHash !== cachedHash &&
    !isStreaming;

  const competitionCode = match?.competition?.code;
  const backHref = competitionCode ? `/competition/${competitionCode}` : '/';
  const backLabel = competitionCode
    ? match?.competition?.name ?? 'Competition'
    : 'Home';

  const isLive = match?.status === 'IN_PLAY';

  return (
    <div className="min-h-screen bg-tv-bg text-tv-text">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back link */}
        <Link
          href={backHref}
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
          Back to {backLabel}
        </Link>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <LoadingSkeleton lines={2} />
            <LoadingSkeleton lines={6} />
            <LoadingSkeleton lines={4} />
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <ErrorState
            message="Failed to load match data."
            onRetry={() => retryMatch()}
          />
        )}

        {/* Match content */}
        {!isLoading && !error && match && (
          <div className="space-y-6">
            {/* Live indicator */}
            {isLive && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tv-live opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-tv-live" />
                </span>
                <span className="text-tv-live text-sm font-semibold uppercase tracking-wide">
                  Live
                </span>
              </div>
            )}

            {/* Match header */}
            <MatchHeader match={match} />

            {/* Pitch with formations */}
            <div className="bg-tv-surface rounded-lg border border-tv-border overflow-hidden">
              <h2 className="text-sm font-semibold text-tv-text-muted uppercase tracking-wider px-4 pt-4 pb-2">
                Formations
              </h2>
              <div className="px-4 pb-4">
                <PitchSVG>
                  <FormationOverlay
                    formation={match.homeTeam?.formation}
                    isHome={true}
                    players={match.lineups?.homeTeam?.startingXI}
                    substitutions={match.substitutions}
                    label={match.homeTeam?.shortName ?? match.homeTeam?.name}
                  />
                  <FormationOverlay
                    formation={match.awayTeam?.formation}
                    isHome={false}
                    players={match.lineups?.awayTeam?.startingXI}
                    substitutions={match.substitutions}
                    label={match.awayTeam?.shortName ?? match.awayTeam?.name}
                  />
                </PitchSVG>
              </div>
            </div>

            {/* Event timeline */}
            <div className="bg-tv-surface rounded-lg border border-tv-border p-4">
              <h2 className="text-sm font-semibold text-tv-text-muted uppercase tracking-wider mb-3">
                Match Events
              </h2>
              <EventTimeline
                goals={match.goals ?? []}
                bookings={match.bookings ?? []}
                substitutions={match.substitutions ?? []}
              />
            </div>

            {/* Tactical Analysis */}
            <div className="bg-tv-surface rounded-lg border border-tv-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-tv-text-muted uppercase tracking-wider">
                  Tactical Analysis
                </h2>
                {!isStreaming && (
                  <button
                    onClick={handleGetAnalysis}
                    disabled={isStreaming}
                    className="px-4 py-2 bg-tv-accent text-white text-sm font-semibold rounded-md hover:bg-tv-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analysisText ? 'Refresh Analysis' : 'Get AI Analysis'}
                  </button>
                )}
                {isStreaming && (
                  <div className="flex items-center gap-2 text-tv-text-muted text-sm">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Analysing…
                  </div>
                )}
              </div>

              {/* New events prompt */}
              {hasNewEvents && (
                <div className="mb-3 flex items-center justify-between bg-tv-surface-hover border border-tv-border rounded-md px-3 py-2">
                  <span className="text-sm text-tv-text-muted">
                    New match events — analysis may be outdated.
                  </span>
                  <button
                    onClick={handleRefreshAnalysis}
                    className="text-sm font-medium text-tv-accent hover:text-tv-accent/80 transition-colors ml-4 whitespace-nowrap"
                  >
                    Refresh analysis?
                  </button>
                </div>
              )}

              {/* Analysis error */}
              {analysisError && (
                <div className="mb-3 text-sm text-tv-live bg-tv-live/10 border border-tv-live/30 rounded-md px-3 py-2">
                  {analysisError}
                </div>
              )}

              {/* Analysis text */}
              {(analysisText || isStreaming) && (
                <div
                  className={`text-tv-text text-sm leading-relaxed whitespace-pre-wrap${isStreaming ? ' streaming-cursor' : ''}`}
                >
                  {analysisText}
                </div>
              )}

              {/* Empty state */}
              {!analysisText && !isStreaming && !analysisError && (
                <p className="text-tv-text-muted text-sm">
                  Click &ldquo;Get AI Analysis&rdquo; to receive a tactical breakdown of this match.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
