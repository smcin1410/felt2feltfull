import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/dbConnect';
import { Itinerary } from '@/models/Itinerary';
import Invitation from '@/models/Invitation';
import User from '@/models/user';

const inviteSchema = z.object({
  itineraryId: z.string(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['editor', 'viewer'])
});

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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
    const validatedData = inviteSchema.parse(body);
    const { itineraryId, email, role } = validatedData;

    await dbConnect();

    // Check if itinerary exists and user is the owner
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    if (itinerary.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the owner can send invitations' },
        { status: 403 }
      );
    }

    // Check if user is already a collaborator
    const isAlreadyCollaborator = itinerary.collaborators.some(
      (collab: any) => collab.user.toString() === session.user.id
    );

    if (isAlreadyCollaborator) {
      return NextResponse.json(
        { error: 'User is already a collaborator' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await Invitation.findOne({
      itineraryId,
      email: email.toLowerCase(),
      status: 'pending'
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create invitation
    const invitation = await Invitation.create({
      itineraryId,
      email: email.toLowerCase(),
      role,
      token,
      expiresAt,
      invitedBy: session.user.id
    });

    // Send email invitation
    try {
      const transporter = createTransporter();
      const inviteUrl = `${process.env.NEXTAUTH_URL}/invite?token=${token}`;
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: `You're invited to collaborate on "${itinerary.name}" - Felt2Felt`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">You're invited to collaborate!</h2>
            <p>You've been invited to collaborate on the trip "${itinerary.name}" on Felt2Felt.</p>
            <p>Your role: <strong>${role}</strong></p>
            <div style="margin: 30px 0;">
              <a href="${inviteUrl}" 
                 style="background: linear-gradient(to right, #ec4899, #db2777); 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              This invitation will expire in 24 hours. If you don't have an account, you'll be prompted to create one.
            </p>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link: ${inviteUrl}
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Delete the invitation if email fails
      await Invitation.findByIdAndDelete(invitation._id);
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Invitation sent successfully',
        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Invitation error:', error);
    
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