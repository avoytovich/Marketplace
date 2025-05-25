import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getTokenFromHeader,
  getTokenFromCookie,
  verifyTokenEdge,
} from './utils/edge-auth';

export async function middleware(request: NextRequest) {
  // List of public paths that don't require authentication
  const publicPaths = [
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/check',
    '/api/auth/signout',
    '/',
    '/signin',
    '/signup',
  ];

  const path = request.nextUrl.pathname;
  console.log('Accessing path:', path);

  // Check if the path is public
  if (publicPaths.includes(path)) {
    console.log('Public path accessed:', path);
    return NextResponse.next();
  }

  try {
    // Try to get token from cookie first, then fall back to header
    const cookieToken = getTokenFromCookie(request);
    const headerToken = getTokenFromHeader(request);
    const token = cookieToken || headerToken;

    console.log('Auth check for path:', path);
    console.log('Cookie token present:', !!cookieToken);
    console.log('Header token present:', !!headerToken);

    if (!token) {
      console.log('No token found for path:', path);
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Verify token
    try {
      const decoded = await verifyTokenEdge(token);
      console.log('Token verified successfully for path:', path);
      console.log('User ID:', decoded.userId);
      console.log('User role:', decoded.role);

      // Add user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user-id', decoded.userId.toString());
      requestHeaders.set('user-role', decoded.role);

      // Return response with modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (verifyError) {
      console.error('Token verification failed for path:', path);
      console.error('Verification error:', verifyError);

      // Clear the invalid token cookie
      const response = new NextResponse(
        JSON.stringify({ message: 'Invalid token' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );

      response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Expire immediately
      });

      return response;
    }
  } catch (error) {
    console.error('Middleware error for path:', path);
    console.error('Error details:', error);

    return new NextResponse(
      JSON.stringify({ message: 'Authentication failed' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|favicon.ico|logo.png|images|signin|signup).*)',
  ],
};
