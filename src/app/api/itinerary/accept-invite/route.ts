import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import { Itinerary } from '@/models/Itinerary';
import Invitation from '@/models/Invitation';
import User from '@/models/user';

const acceptInviteSchema = z.object({
  token: z.string()
});

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
    const validatedData = acceptInviteSchema.parse(body);
    const { token } = validatedData;

    await dbConnect();

    // Find the invitation
    const invitation = await Invitation.findOne({
      token,
      status: 'pending'
    }).populate('itineraryId');

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (invitation.expiresAt < new Date()) {
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'expired' });
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Check if the user's email matches the invitation
    if (session.user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This invitation is for a different email address' },
        { status: 403 }
      );
    }

    // Find the itinerary
    const itinerary = await Itinerary.findById(invitation.itineraryId);
    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    // Check if user is already a collaborator
    const isAlreadyCollaborator = itinerary.collaborators.some(
      (collab: any) => collab.user.toString() === session.user.id
    );

    if (isAlreadyCollaborator) {
      // Mark invitation as accepted even if already a collaborator
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'accepted' });
      return NextResponse.json(
        { 
          message: 'You are already a collaborator on this itinerary',
          itinerary: {
            id: itinerary._id,
            name: itinerary.name
          }
        }
      );
    }

    // Add user as collaborator
    itinerary.collaborators.push({
      user: session.user.id,
      role: invitation.role
    });

    await itinerary.save();

    // Mark invitation as accepted
    await Invitation.findByIdAndUpdate(invitation._id, { status: 'accepted' });

    return NextResponse.json(
      { 
        message: 'Invitation accepted successfully',
        itinerary: {
          id: itinerary._id,
          name: itinerary.name,
          role: invitation.role
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Accept invitation error:', error);
    
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

// GET route to validate invitation token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the invitation
    const invitation = await Invitation.findOne({
      token,
      status: 'pending'
    }).populate('itineraryId').populate('invitedBy', 'name email');

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (invitation.expiresAt < new Date()) {
      await Invitation.findByIdAndUpdate(invitation._id, { status: 'expired' });
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        invitation: {
          email: invitation.email,
          role: invitation.role,
          itinerary: {
            id: invitation.itineraryId._id,
            name: invitation.itineraryId.name
          },
          invitedBy: invitation.invitedBy,
          expiresAt: invitation.expiresAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Validate invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}