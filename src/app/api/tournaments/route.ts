import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tournament from '@/models/Tournament';
import { getRandomImage } from '@/lib/image-utils'; // Import the new function

export async function GET(request) {
  await dbConnect();

  try {
    const tournaments = await Tournament.find({}).lean(); // Use .lean() for plain JS objects

    // Map over the results and assign a random image to each one
    const tournamentsWithImages = tournaments.map(tournament => ({
      ...tournament,
      image: getRandomImage(),
    }));

    return NextResponse.json({ success: true, data: tournamentsWithImages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}