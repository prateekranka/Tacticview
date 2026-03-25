import { NextResponse } from 'next/server';
import { getStandings } from '@/lib/football-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Competition code is required' },
        { status: 400 },
      );
    }

    const data = await getStandings(code);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch standings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standings' },
      { status: 500 },
    );
  }
}
