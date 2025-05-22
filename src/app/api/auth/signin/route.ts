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
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.is_activate) {
      return NextResponse.json(
        { message: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    // Return user data and token
    return NextResponse.json(
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
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
