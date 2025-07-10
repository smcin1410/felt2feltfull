import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import { Itinerary } from '@/models/Itinerary';

const updateItinerarySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
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

// Helper function to check if user has access to itinerary
async function checkItineraryAccess(itineraryId: string, userId: string, requiredRole?: 'owner' | 'editor') {
  const itinerary = await Itinerary.findById(itineraryId);
  
  if (!itinerary) {
    return { hasAccess: false, error: 'Itinerary not found', status: 404 };
  }

  const isOwner = itinerary.owner.toString() === userId;
  const collaborator = itinerary.collaborators.find(
    (collab: any) => collab.user.toString() === userId
  );

  if (!isOwner && !collaborator) {
    return { hasAccess: false, error: 'Access denied', status: 403 };
  }

  if (requiredRole === 'owner' && !isOwner) {
    return { hasAccess: false, error: 'Only owner can perform this action', status: 403 };
  }

  if (requiredRole === 'editor' && !isOwner && collaborator?.role !== 'editor') {
    return { hasAccess: false, error: 'Editor access required', status: 403 };
  }

  return { hasAccess: true, itinerary, isOwner, userRole: isOwner ? 'owner' : collaborator?.role };
}

// GET - Fetch specific itinerary
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const params = await context.params;
    const accessCheck = await checkItineraryAccess(params.id, session.user.id);
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    const itinerary = await Itinerary.findById(params.id)
      .populate('owner', 'name email')
      .populate('collaborators.user', 'name email');

    return NextResponse.json({ 
      itinerary,
      userRole: accessCheck.userRole
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch itinerary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update itinerary
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateItinerarySchema.parse(body);

    await dbConnect();

    const params = await context.params;
    const accessCheck = await checkItineraryAccess(params.id, session.user.id, 'editor');
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true }
    )
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email');

    return NextResponse.json(
      { 
        message: 'Itinerary updated successfully',
        itinerary: updatedItinerary
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update itinerary error:', error);
    
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

// DELETE - Delete itinerary
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const params = await context.params;
    const accessCheck = await checkItineraryAccess(params.id, session.user.id, 'owner');
    if (!accessCheck.hasAccess) {
      return NextResponse.json(
        { error: accessCheck.error },
        { status: accessCheck.status }
      );
    }

    await Itinerary.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Itinerary deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete itinerary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}