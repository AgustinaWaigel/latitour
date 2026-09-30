import { NextRequest, NextResponse } from 'next/server';
import { getPlaces } from '@/lib/data';
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('ids') || '';
  const ids = raw
    .split(',')
    .filter((v) => /^[0-9a-f-]{36}$/i.test(v))
    .slice(0, 100);
  if (!ids.length) return NextResponse.json([]);
  try {
    return NextResponse.json(await getPlaces({ ids }), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'No pudimos cargar los lugares.' },
      { status: 500 },
    );
  }
}
