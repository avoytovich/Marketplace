import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const seller_id = searchParams.get('seller_id');

    if (!seller_id) {
      return NextResponse.json(
        { message: 'Missing seller_id parameter' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_DATABASE_URL) {
      console.error('DATABASE_DATABASE_URL is not set');
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    let sql;
    try {
      sql = neon(`${process.env.DATABASE_DATABASE_URL}`); // Initialize the database connection
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      return NextResponse.json(
        { message: 'Database connection initialization failed' },
        { status: 500 }
      );
    }

    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Fetch proposals where the user isn't the seller (don't propose for yourself) and matches the request_id
    const result = await sql.query(
      `SELECT * FROM users
       WHERE user_id = $1`,
      [seller_id]
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
