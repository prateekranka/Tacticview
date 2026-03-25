import { NextResponse } from 'next/server';
import { getMatch } from '@/lib/football-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id, 10);

    if (isNaN(matchId) || matchId <= 0) {
      return NextResponse.json(
        { error: 'Invalid match ID' },
        { status: 400 },
      );
    }

    const data = await getMatch(matchId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 },
    );
  }
}
