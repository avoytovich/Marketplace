import { NextResponse } from 'next/server';
import User from '../../../../../models/Users';
import { hashPassword, generateToken } from '../../../../utils/auth';
import sequelize from '../../../../../sequelize';

// Ensure DB is synced
async function initDB() {
  await sequelize.sync();
}

export async function POST(req: Request) {
  try {
    await initDB();
    const { username, email, password, role = 'user' } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role,
      is_activate: true,
      created_at: new Date(),
    });

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
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
