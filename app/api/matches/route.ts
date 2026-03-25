import { NextRequest, NextResponse } from 'next/server';
import { getMatches } from '@/lib/football-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params: {
      competitions?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
    } = {};

    const competitions = searchParams.get('competitions');
    if (competitions) params.competitions = competitions;

    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) params.dateFrom = dateFrom;

    const dateTo = searchParams.get('dateTo');
    if (dateTo) params.dateTo = dateTo;

    const status = searchParams.get('status');
    if (status) params.status = status;

    const data = await getMatches(params);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 },
    );
  }
}
