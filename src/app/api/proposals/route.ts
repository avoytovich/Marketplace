import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { request_id, seller_id, price, delivery_time, message, portfolio_url } = body;

    if (!request_id || !seller_id || !price || !delivery_time || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);

    // Insert the proposal into the database
    const result = await sql.query(
      `INSERT INTO proposals (request_id, seller_id, price, estimated_time, message, portfolio_url, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
       RETURNING *`,
      [request_id, seller_id, price, delivery_time, message, portfolio_url]
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
