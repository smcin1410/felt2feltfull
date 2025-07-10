import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import { Itinerary } from '@/models/Itinerary';

const createItinerarySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    location: z.string().optional(),
    city: z.string().optional(),
    dates: z.string().optional(),
    buyin: z.number().optional(),
    priority: z.string().optional()
  })).optional()
});

// GET - Fetch user's itineraries
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find itineraries where user is owner or collaborator
    const itineraries = await Itinerary.find({
      $or: [
        { owner: session.user.id },
        { 'collaborators.user': session.user.id }
      ]
    })
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort({ updatedAt: -1 });

    return NextResponse.json({ itineraries }, { status: 200 });

  } catch (error) {
    console.error('Fetch itineraries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new itinerary
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createItinerarySchema.parse(body);

    await dbConnect();

    const itinerary = await Itinerary.create({
      name: validatedData.name,
      owner: session.user.id,
      items: validatedData.items || [],
      collaborators: []
    });

    const populatedItinerary = await Itinerary.findById(itinerary._id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email');

    return NextResponse.json(
      { 
        message: 'Itinerary created successfully',
        itinerary: populatedItinerary
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create itinerary error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}