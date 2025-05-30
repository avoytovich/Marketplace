import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getTokenFromHeader,
  getTokenFromCookie,
  verifyToken,
} from './utils/auth';

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

  // Check if the path is public
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  try {
    // Try to get token from cookie first, then fall back to header
    const cookieToken = getTokenFromCookie(request);
    const headerToken = getTokenFromHeader(request);
    const token = cookieToken || headerToken;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Verify token
    try {
      const decoded = await verifyToken(token);

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
