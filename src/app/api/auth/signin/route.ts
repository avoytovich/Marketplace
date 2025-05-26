import { NextResponse } from 'next/server';
import User from '../../../../../models/Users';
import { comparePasswords, generateToken } from '../../../../utils/auth';
import sequelize from '../../../../../sequelize';

// Ensure DB is synced
async function initDB() {
  await sequelize.sync();
}

export async function POST(req: Request) {
  try {
    await initDB();
    const { email, password } = await req.json();
    console.log('Signin attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePasswords(
      password,
      user.password_hash
    );

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.is_activate) {
      console.log('Inactive user attempted login:', email);
      return NextResponse.json(
        { message: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Generate token
    const token = await generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });
    console.log('Generated token for user:', email);

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    // Set cookie with strict security settings
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    console.log('Cookie set for user:', email);

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
