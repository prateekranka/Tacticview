import type { Goal, Booking, Substitution } from '@/lib/types';

interface EventItemProps {
  event: Goal | Booking | Substitution;
  type: 'goal' | 'booking' | 'substitution';
  isNew?: boolean;
}

function isGoal(event: Goal | Booking | Substitution, type: string): event is Goal {
  return type === 'goal';
}

function isBooking(event: Goal | Booking | Substitution, type: string): event is Booking {
  return type === 'booking';
}

function isSubstitution(event: Goal | Booking | Substitution, type: string): event is Substitution {
  return type === 'substitution';
}

export default function EventItem({ event, type, isNew }: EventItemProps) {
  let icon: string;
  let description: string;
  let teamName: string;

  if (isGoal(event, type)) {
    icon = '\u26BD';
    const typeLabel = event.type === 'OWN' ? ' (OG)' : event.type === 'PENALTY' ? ' (Pen)' : '';
    const assistText = event.assist ? ` (assist: ${event.assist.name})` : '';
    description = `${event.scorer.name}${typeLabel}${assistText}`;
    teamName = event.team.name;
  } else if (isBooking(event, type)) {
    icon = event.card === 'YELLOW' ? '\uD83D\uDFE8' : '\uD83D\uDFE5';
    const cardLabel = event.card === 'YELLOW' ? '' : event.card === 'YELLOW_RED' ? ' (2nd Yellow)' : ' (Red)';
    description = `${event.player.name}${cardLabel}`;
    teamName = event.team.name;
  } else if (isSubstitution(event, type)) {
    icon = '\uD83D\uDD04';
    description = `${event.playerOut.name} \u2192 ${event.playerIn.name}`;
    teamName = event.team.name;
  } else {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-md px-3 py-2 transition-colors ${
        isNew ? 'animate-pulse border-l-2 border-tv-goal bg-tv-goal/10' : ''
      }`}
    >
      <span className="mt-0.5 text-base leading-none">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="shrink-0 text-xs font-mono text-tv-text-muted">
            {event.minute}&apos;
          </span>
          <span className="text-sm text-tv-text">{description}</span>
        </div>
        <p className="text-xs text-tv-text-muted">{teamName}</p>
      </div>
    </div>
  );
}
