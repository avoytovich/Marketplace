import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ message: 'Successfully signed out' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );

  // Clear the token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/', // Add this to ensure cookie is deleted across all routes
    maxAge: 0, // Expire immediately
  });

  return response;
}
