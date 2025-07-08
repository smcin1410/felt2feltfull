import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

// Use path aliases for cleanliness
import Location from '@/models/Location';
import PokerRoom from '@/models/PokerRoom';
import Tournament from '@/models/Tournament';

export async function GET(request) {
  await dbConnect(); // This now pre-registers all models

  try {
    const locations = await Location.find({})
      .populate('pokerRooms')
      .populate('tournaments');

    return NextResponse.json({ success: true, data: locations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}