import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromHeader, verifyToken } from './utils/auth';

export async function middleware(request: NextRequest) {
  // List of public paths that don't require authentication
  const publicPaths = [
    '/api/auth/signin',
    '/api/auth/signup',
    '/',
    '/signin',
    '/signup',
  ];

  // Check if the path is public
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  try {
    const token = getTokenFromHeader(request);

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

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
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|favicon.ico|logo.png|images|signin|signup).*)',
  ],
};
