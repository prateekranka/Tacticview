'use client';

import { useRef, useMemo } from 'react';
import type { Goal, Booking, Substitution } from '@/lib/types';
import EventItem from './EventItem';

interface EventTimelineProps {
  goals: Goal[];
  bookings: Booking[];
  substitutions: Substitution[];
  className?: string;
}

interface TimelineEvent {
  event: Goal | Booking | Substitution;
  type: 'goal' | 'booking' | 'substitution';
  minute: number;
}

export default function EventTimeline({ goals, bookings, substitutions, className = '' }: EventTimelineProps) {
  const prevCountRef = useRef(0);

  const events = useMemo<TimelineEvent[]>(() => {
    const all: TimelineEvent[] = [
      ...goals.map((e) => ({ event: e, type: 'goal' as const, minute: e.minute })),
      ...bookings.map((e) => ({ event: e, type: 'booking' as const, minute: e.minute })),
      ...substitutions.map((e) => ({ event: e, type: 'substitution' as const, minute: e.minute })),
    ];
    all.sort((a, b) => a.minute - b.minute);
    return all;
  }, [goals, bookings, substitutions]);

  const totalCount = events.length;
  const prevCount = prevCountRef.current;
  // Update ref after render comparison
  prevCountRef.current = totalCount;

  if (events.length === 0) {
    return (
      <div className={`rounded-lg border border-tv-border bg-tv-surface p-4 ${className}`}>
        <h3 className="mb-3 text-sm font-semibold text-tv-text">Match Events</h3>
        <p className="text-center text-sm text-tv-text-muted">No events yet</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-tv-border bg-tv-surface p-4 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold text-tv-text">Match Events</h3>
      <div className="space-y-1">
        {events.map((item, index) => (
          <EventItem
            key={`${item.type}-${item.minute}-${index}`}
            event={item.event}
            type={item.type}
            isNew={index >= prevCount && prevCount > 0}
          />
        ))}
      </div>
    </div>
  );
}
