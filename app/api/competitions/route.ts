import { NextResponse } from 'next/server';
import { getCompetitions } from '@/lib/football-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getCompetitions();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch competitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 },
    );
  }
}
