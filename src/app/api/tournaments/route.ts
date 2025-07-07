// src/app/api/tournaments/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("felt2felt"); // Replace with your database name

    const tournaments = await db
      .collection('tournaments')
      .find({ startDate: { $gte: new Date() } })
      .sort({ startDate: 1 })
      .limit(5)
      .toArray();

    return NextResponse.json(tournaments);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error fetching tournaments' }, { status: 500 });
  }
}
