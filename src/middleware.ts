import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/destinations',
          '/tournaments',
          '/community',
          '/blog'
        ];
        
        // API routes that don't require authentication
        const publicApiRoutes = [
          '/api/auth',
          '/api/destinations',
          '/api/tournaments',
          '/api/posts'
        ];
        
        // Check if it's a public route
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // Check if it's a public API route
        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};