import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    id: 'sample-trip',
    name: 'Sample Poker Trip',
    destinations: ['Las Vegas', 'Atlantic City'],
    dates: ['2025-08-01', '2025-08-07'],
    travelers: ['Alice', 'Bob'],
    status: 'planning',
  });
} 