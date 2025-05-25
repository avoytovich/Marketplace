import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie, verifyToken } from '../../../../utils/auth';
import User from '../../../../../models/Users';
import sequelize from '../../../../../sequelize';

// Ensure DB is synced
async function initDB() {
  await sequelize.sync();
}

export async function GET(req: NextRequest) {
  try {
    await initDB();

    // Get token from cookie
    const token = getTokenFromCookie(req);
    console.log('Auth check - token from cookie:', token);

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    try {
      const decoded = verifyToken(token);
      console.log('Auth check - decoded token:', decoded);

      // Get user from database
      const user = await User.findOne({
        where: {
          user_id: decoded.userId,
        },
      });

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
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
}
