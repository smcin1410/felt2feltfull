import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
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
        
        // Find user with password field included
        const user = await User.findOne({
          email: credentials.email.toLowerCase()
        }).select('+password');

        if (!user) {
          return null;
        }

        // Verify password
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

const handler = NextAuth({
  providers,
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      
      // Handle Google OAuth
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
            // Create new user for Google OAuth
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
    
    async session({ session, token }) {
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
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-only',
});

export { handler as GET, handler as POST };