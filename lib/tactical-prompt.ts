import type { Match, Goal, Booking, Substitution } from './types';

/**
 * Build a simple hash of match events for caching / change detection.
 */
export function getEventsHash(match: Match): string {
  return `${match.goals.length}-${match.bookings.length}-${match.substitutions.length}`;
}

/**
 * Describe the current match state in plain text.
 */
export function getMatchStateDescription(match: Match): string {
  const home = match.homeTeam.shortName || match.homeTeam.name;
  const away = match.awayTeam.shortName || match.awayTeam.name;
  const homeGoals = match.score.fullTime.home ?? 0;
  const awayGoals = match.score.fullTime.away ?? 0;

  switch (match.status) {
    case 'IN_PLAY':
      return `LIVE ${match.minute ? `(${match.minute}')` : ''}: ${home} ${homeGoals} - ${awayGoals} ${away}`;
    case 'PAUSED':
      return `HALF-TIME: ${home} ${homeGoals} - ${awayGoals} ${away}`;
    case 'FINISHED':
      return `FULL-TIME: ${home} ${homeGoals} - ${awayGoals} ${away}`;
    case 'SCHEDULED':
    case 'TIMED':
      return `UPCOMING: ${home} vs ${away}`;
    default:
      return `${match.status}: ${home} vs ${away}`;
  }
}

/**
 * Build a chronological text listing of match events.
 */
export function buildMatchEventsText(match: Match): string {
  const events: { minute: number; injuryTime?: number | null; text: string }[] = [];

  match.goals.forEach((g: Goal) => {
    const time = g.injuryTime ? `${g.minute}+${g.injuryTime}'` : `${g.minute}'`;
    const type = g.type === 'OWN' ? ' (OG)' : g.type === 'PENALTY' ? ' (PEN)' : '';
    const assist = g.assist ? ` (assist: ${g.assist.name})` : '';
    events.push({
      minute: g.minute,
      injuryTime: g.injuryTime,
      text: `⚽ ${time} GOAL${type}: ${g.scorer.name} [${g.team.name}]${assist}`,
    });
  });

  match.bookings.forEach((b: Booking) => {
    const cardEmoji = b.card === 'YELLOW' ? '🟨' : '🟥';
    events.push({
      minute: b.minute,
      text: `${cardEmoji} ${b.minute}' ${b.card}: ${b.player.name} [${b.team.name}]`,
    });
  });

  match.substitutions.forEach((s: Substitution) => {
    events.push({
      minute: s.minute,
      text: `🔄 ${s.minute}' SUB [${s.team.name}]: ${s.playerIn.name} ON for ${s.playerOut.name}`,
    });
  });

  events.sort((a, b) => {
    if (a.minute !== b.minute) return a.minute - b.minute;
    return (a.injuryTime ?? 0) - (b.injuryTime ?? 0);
  });

  if (events.length === 0) return 'No events yet.';
  return events.map((e) => e.text).join('\n');
}

/**
 * Build lineup text for both teams.
 */
export function buildLineupText(match: Match): string {
  const parts: string[] = [];

  if (match.lineups?.homeTeam) {
    const ht = match.lineups.homeTeam;
    parts.push(`${match.homeTeam.name} (${ht.formation || 'unknown formation'}):`);
    parts.push(`  Starting XI: ${ht.startingXI.map((p) => `${p.name}${p.shirtNumber ? ` #${p.shirtNumber}` : ''}`).join(', ')}`);
    if (ht.bench.length > 0) {
      parts.push(`  Bench: ${ht.bench.map((p) => `${p.name}${p.shirtNumber ? ` #${p.shirtNumber}` : ''}`).join(', ')}`);
    }
  }

  if (match.lineups?.awayTeam) {
    const at = match.lineups.awayTeam;
    parts.push(`${match.awayTeam.name} (${at.formation || 'unknown formation'}):`);
    parts.push(`  Starting XI: ${at.startingXI.map((p) => `${p.name}${p.shirtNumber ? ` #${p.shirtNumber}` : ''}`).join(', ')}`);
    if (at.bench.length > 0) {
      parts.push(`  Bench: ${at.bench.map((p) => `${p.name}${p.shirtNumber ? ` #${p.shirtNumber}` : ''}`).join(', ')}`);
    }
  }

  if (parts.length === 0) return 'Lineups not yet available.';
  return parts.join('\n');
}

/**
 * Build the full system + user prompt for Claude's tactical analysis.
 */
export function buildTacticalPrompt(
  match: Match,
  trigger: string,
): { system: string; user: string } {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';

  const system = `You are TacticView's expert football tactical analyst. Your role is to provide insightful, accessible tactical analysis of football matches.

Guidelines:
- Write 2-4 concise paragraphs of analysis.
- Use a warm, casual-friendly tone — like a knowledgeable friend explaining tactics at the pub.
- When you use tactical jargon (pressing triggers, half-spaces, inverted fullbacks, etc.), briefly explain what it means in practical terms.
- Focus on the "why" behind what's happening, not just describing events.
- Consider formations, player roles, tactical matchups, and momentum shifts.
- If a notable event just happened (goal, red card, substitution), analyze its tactical implications.
${isLive ? '- End your analysis with a "What to watch for next" section since the match is live.' : ''}
- Do NOT use markdown headers or bullet points. Write in flowing paragraphs.
- Keep it concise — no more than 4 paragraphs total.`;

  const home = match.homeTeam.name;
  const away = match.awayTeam.name;
  const homeGoals = match.score.fullTime.home;
  const awayGoals = match.score.fullTime.away;
  const htHome = match.score.halfTime.home;
  const htAway = match.score.halfTime.away;

  const stateDesc = getMatchStateDescription(match);
  const eventsText = buildMatchEventsText(match);
  const lineupText = buildLineupText(match);

  const homeFormation = match.lineups?.homeTeam?.formation || 'unknown';
  const awayFormation = match.lineups?.awayTeam?.formation || 'unknown';

  let triggerSection = '';
  if (trigger && trigger !== 'manual' && trigger !== 'auto') {
    triggerSection = `\n\n=== JUST HAPPENED ===\n${trigger}\nAnalyze the tactical implications of this event specifically.\n`;
  }

  const user = `Match: ${home} vs ${away}
Competition: ${match.competition.name}
Status: ${stateDesc}
Score: ${homeGoals ?? '-'} - ${awayGoals ?? '-'} (HT: ${htHome ?? '-'} - ${htAway ?? '-'})
${match.minute ? `Minute: ${match.minute}'${match.injuryTime ? ` +${match.injuryTime}` : ''}` : ''}

Formations:
  ${home}: ${homeFormation}
  ${away}: ${awayFormation}

Lineups:
${lineupText}

Match Events:
${eventsText}
${triggerSection}
Provide tactical analysis of this match.${isLive ? " Include 'What to watch for' at the end." : ''}`;

  return { system, user };
}
