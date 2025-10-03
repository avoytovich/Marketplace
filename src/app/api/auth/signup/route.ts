import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { hashPassword, generateToken } from '../../../../utils/auth';

export async function POST(req: Request) {
  try {
    const { username, email, password, role = 'user' } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Check if user already exists
    const userCheck = await sql.query(
      'SELECT user_id FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    if (userCheck.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user (returns all columns, including auto-generated user_id)
    const createUserResult = await sql.query(
      `
      INSERT INTO users (username, email, password_hash, role, is_activate, created_at)
      VALUES ($1, $2, $3, $4, true, NOW())
      RETURNING user_id, username, email, role
      `,
      [username, email, hashedPassword, role]
    );

    const user = createUserResult[0];

    // Generate token
    const token = await generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    // Create response with user data and token
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
      { status: 201 }
    );

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
