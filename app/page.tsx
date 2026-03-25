import Link from 'next/link';
import { COMPETITIONS } from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-tv-bg text-tv-text">
      {/* Hero */}
      <section className="border-b border-tv-border bg-tv-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-tv-border bg-tv-surface-hover px-4 py-1.5 text-sm text-tv-text-muted">
            <span className="h-2 w-2 rounded-full bg-tv-live animate-pulse inline-block" />
            Live match data &amp; tactical insights
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Tactic<span className="text-tv-accent">View</span>
          </h1>
          <p className="mt-4 text-lg text-tv-text-muted sm:text-xl">
            Your live football tactical companion
          </p>
          <p className="mt-2 text-sm text-tv-text-muted max-w-xl mx-auto">
            Follow live scores, explore standings, and get AI-powered tactical analysis across the top football leagues.
          </p>
        </div>
      </section>

      {/* Competitions grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-semibold text-tv-text">
          Competitions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMPETITIONS.map((comp) => (
            <Link
              key={comp.code}
              href={`/competition/${comp.code}`}
              className="group flex items-center gap-4 rounded-xl border border-tv-border bg-tv-surface px-5 py-4 transition-colors hover:border-tv-accent/40 hover:bg-tv-surface-hover"
            >
              <span className="text-3xl leading-none" role="img" aria-label={comp.country}>
                {comp.flag}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-tv-text group-hover:text-tv-accent transition-colors">
                  {comp.name}
                </p>
                <p className="mt-0.5 truncate text-sm text-tv-text-muted">
                  {comp.description}
                </p>
              </div>
              <svg
                className="h-4 w-4 shrink-0 text-tv-border group-hover:text-tv-accent transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
