import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ message: 'Successfully signed out' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );

  // Clear the token cookie by expiring it immediately
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',     // Ensure cookie is deleted site-wide
    maxAge: 0,     // Expire immediately
  });

  return response;
}
