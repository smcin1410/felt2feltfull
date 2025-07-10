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

// Build providers array conditionally
const providers: any[] = [
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
        const connection = await dbConnect();
        
        // If no database connection available, return null
        if (!connection) {
          console.warn('Database connection not available during authentication');
          return null;
        }
        
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
  })
];

// Only add Google provider if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Auth options (duplicated from the main auth route for now)
const authOptions = {
  providers,
  
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      
      if (account?.provider === 'google' && user) {
        try {
          const connection = await dbConnect();
          
          // If no database connection available, skip database operations
          if (!connection) {
            console.warn('Database connection not available during JWT callback');
            return token;
          }
          
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
    // Check if Pusher is configured
    if (!pusherServer) {
      console.warn('Pusher server not configured - environment variables missing');
      return NextResponse.json({ error: 'Pusher not configured' }, { status: 503 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { channel, event, data } = await request.json();

    if (!channel || !event || !data) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Extract itinerary ID from channel name (format: itinerary-{id})
    const itineraryId = channel.replace('itinerary-', '');
    
    // Verify user has access to this itinerary
    const connection = await dbConnect();
    
    // If no database connection available, skip database verification
    if (!connection) {
      console.warn('Database connection not available during Pusher trigger');
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }
    
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

    // Trigger the event
    await pusherServer.trigger(channel, event, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}