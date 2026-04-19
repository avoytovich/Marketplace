import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { request_id, seller_id, price, estimated_time, message, portfolio_url } = body;

    if (!request_id || !seller_id || !price || !estimated_time || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
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

    // Insert the proposal into the database
    const result = await sql.query(
      `INSERT INTO proposals (request_id, seller_id, price, estimated_time, message, portfolio_url, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
       RETURNING *`,
      [request_id, seller_id, price, estimated_time, message, portfolio_url]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { message: 'Failed to create proposal' },
        { status: 500 }
      );
    }

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const request_id = searchParams.get('request_id');

    if (!request_id) {
      return NextResponse.json(
        { message: 'Missing request_id parameter' },
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
      `SELECT * FROM proposals
       WHERE request_id = $1 AND seller_id != $2`,
      [request_id, userId]
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
