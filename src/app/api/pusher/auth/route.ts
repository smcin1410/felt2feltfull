import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { pusherServer } from '@/lib/pusher';
import dbConnect from '@/lib/dbConnect';
import Itinerary from '@/models/Itinerary';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import User from '@/models/user';

// Auth options (duplicated from the main auth route for now)
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();
          
          const user = await User.findOne({
            email: credentials.email.toLowerCase()
          }).select('+password');

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || '',
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      
      if (account?.provider === 'google' && user) {
        try {
          await dbConnect();
          
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              authProvider: 'google',
              isVerified: true
            });
          }
          
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  
  pages: {
    signIn: '/auth/signin'
  },
  
  session: {
    strategy: 'jwt' as const,
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Extract itinerary ID from channel name (format: itinerary-{id})
    const itineraryId = channelName.replace('itinerary-', '');
    
    // Verify user has access to this itinerary
    await dbConnect();
    const itinerary = await Itinerary.findById(itineraryId);
    
    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    // Check if user is owner or collaborator
    const isOwner = itinerary.owner.toString() === session.user.id;
    const isCollaborator = itinerary.collaborators.some(
      (collaborator: any) => collaborator.user.toString() === session.user.id
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Authenticate the user for this channel
    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        email: session.user.email,
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}