import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getTokenFromCookie, verifyToken } from '../../../../utils/auth';

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie
    const token = getTokenFromCookie(req);

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    try {
      const decoded = await verifyToken(token);

      let user;
      if (decoded) {
        const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
        const result = await sql.query(
          'SELECT user_id, username, email, role FROM users WHERE user_id = $1 LIMIT 1',
          [decoded.userId]
        );
        user = result[0];
      }

      if (!user) {
        console.log('Auth check - user not found for id:', decoded.userId);
        return NextResponse.json(
          { message: 'User not found' },
          { status: 401 }
        );
      }

      // Return user data and token
      return NextResponse.json({
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (verifyError) {
      console.error('Auth check - token verification failed:', verifyError);
      throw verifyError;
    }
  } catch (error) {
    console.log('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
}