import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Define TypeScript interfaces for the request structure
interface User {
  user_id: number;
  username: string;
  email: string;
  profile_picture: string | null;
}

interface File {
  file_id: number;
  file_url: string;
  uploaded_at: string;
}

interface Proposal {
  proposal_id: number;
  seller_id: number;
  price: number;
  estimated_time: string;
  message: string;
  portfolio_url: string | null;
  status: string;
  created_at: string;
}

interface Request {
  request_id: number;
  title: string;
  category: string;
  budget_min: number;
  budget_max: number;
  description: string;
  location: string;
  status: string;
  created_at: string;
  user: User;
  files: File[];
  proposals: Proposal[];
}

// Helper to nest results as in previous answer
function groupRequestData(rows: any[]) {
  if (!rows.length) return null;

  const row = rows[0];
  const request: Request = {
    request_id: row.request_id,
    title: row.title,
    category: row.category,
    budget_min: row.budget_min,
    budget_max: row.budget_max,
    description: row.description,
    location: row.location,
    status: row.status,
    created_at: row.created_at,
    user: {
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      profile_picture: row.profile_picture,
    },
    files: [],
    proposals: [],
  };

  // Aggregate all files and proposals
  const fileSet = new Set();
  const proposalSet = new Set();
  for (const r of rows) {
    if (r.file_id && !fileSet.has(r.file_id)) {
      request.files.push({
        file_id: r.file_id,
        file_url: r.file_url,
        uploaded_at: r.uploaded_at,
      });
      fileSet.add(r.file_id);
    }
    if (r.proposal_id && !proposalSet.has(r.proposal_id)) {
      request.proposals.push({
        proposal_id: r.proposal_id,
        seller_id: r.proposal_seller_id,
        price: r.proposal_price,
        estimated_time: r.estimated_time,
        message: r.proposal_message,
        portfolio_url: r.portfolio_url,
        status: r.proposal_status,
        created_at: r.proposal_created_at,
      });
      proposalSet.add(r.proposal_id);
    }
  }
  return request;
}

export async function GET(req: NextRequest, context: { params: { requestId: string } }) {
  try {
    const params = await context.params;
    const requestId = parseInt(params.requestId);
    if (isNaN(requestId)) {
      return NextResponse.json(
        { message: "Invalid requestId" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);

    // Fetch request info, user, files, and proposals in a single query
    const result = await sql.query(`
      SELECT
        r.*,
        u.user_id,
        u.username,
        u.email,
        u.profile_picture,
        f.file_id,
        f.file_url,
        f.uploaded_at,
        p.proposal_id,
        p.seller_id as proposal_seller_id,
        p.price as proposal_price,
        p.estimated_time,
        p.message as proposal_message,
        p.portfolio_url,
        p.status as proposal_status,
        p.created_at as proposal_created_at
      FROM requests r
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN files f ON f.request_id = r.request_id
      LEFT JOIN proposals p ON p.request_id = r.request_id
      WHERE r.request_id = $1
    `, [requestId]);

    if (!result.length) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    // Group/nest the results
    const request = groupRequestData(result);

    return NextResponse.json(request, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
