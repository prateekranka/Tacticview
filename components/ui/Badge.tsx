'use client';

import type { MatchStatus } from '@/lib/types';

interface BadgeProps {
  status: MatchStatus;
  minute?: number;
  injuryTime?: number;
  className?: string;
}

export default function Badge({ status, minute, injuryTime, className = '' }: BadgeProps) {
  const getStatusDisplay = (): { bg: string; text: string; pulse: boolean } => {
    switch (status) {
      case 'IN_PLAY':
        return {
          bg: 'bg-tv-live',
          text: `${minute ?? ''}${injuryTime ? `+${injuryTime}` : ''}'`,
          pulse: true,
        };
      case 'PAUSED':
        return {
          bg: 'bg-yellow-500',
          text: 'HT',
          pulse: false,
        };
      case 'FINISHED':
        return {
          bg: 'bg-neutral-600',
          text: 'FT',
          pulse: false,
        };
      case 'SCHEDULED':
      case 'TIMED':
        return {
          bg: 'bg-tv-accent-blue',
          text: '',
          pulse: false,
        };
      case 'POSTPONED':
        return {
          bg: 'bg-neutral-600',
          text: 'PPD',
          pulse: false,
        };
      case 'CANCELLED':
        return {
          bg: 'bg-neutral-600',
          text: 'CAN',
          pulse: false,
        };
      case 'SUSPENDED':
        return {
          bg: 'bg-neutral-600',
          text: 'SUS',
          pulse: false,
        };
      case 'AWARDED':
        return {
          bg: 'bg-neutral-600',
          text: 'AWD',
          pulse: false,
        };
      default:
        return {
          bg: 'bg-neutral-600',
          text: status,
          pulse: false,
        };
    }
  };

  const { bg, text, pulse } = getStatusDisplay();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${bg} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
      )}
      {text}
    </span>
  );
}
