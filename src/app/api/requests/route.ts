import { NextResponse, NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';
// import Request from "../../../../models/Requests";
// import initDB from '../../../utils/initDB';

// Helper: Group files/proposals by request
function groupData(rows: any[]) {
  const requests: any[] = [];
  const lookup: Record<number, any> = {};

  for (const row of rows) {
    if (!lookup[row.request_id]) {
      lookup[row.request_id] = {
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
      requests.push(lookup[row.request_id]);
    }
    // Add associated files (if present)
    if (row.file_id) {
      lookup[row.request_id].files.push({
        file_id: row.file_id,
        file_url: row.file_url,
        uploaded_at: row.uploaded_at,
      });
    }
    // Add associated proposals (if present)
    if (row.proposal_id) {
      lookup[row.request_id].proposals.push({
        proposal_id: row.proposal_id,
        seller_id: row.proposal_seller_id, // alias for unambiguous join
        price: row.proposal_price,
        estimated_time: row.estimated_time,
        message: row.proposal_message,
        portfolio_url: row.portfolio_url,
        status: row.proposal_status,
        created_at: row.proposal_created_at,
      });
    }
  }
  return requests;
}

// 🟢 Handle GET Requests
export async function GET() {
  try {
    const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);

    // JOIN requests with users, files, and proposals
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
      ORDER BY r.request_id DESC
    `);

    // Group into nested structure
    const requests = groupData(result);
    console.log('result rows:', result);

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Destructure required and optional fields from the request body
    const {
      user_id,
      title,
      category,
      budget_min,
      budget_max,
      description,
      location,
      status = 'open',
    } = body;

    // Basic validation (adjust as needed)
    if (!user_id || !title || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);

    // Insert new request & return the new row
    const result = await sql.query(
      ` INSERT INTO requests ( user_id, title, category, budget_min, budget_max, description, location, status, created_at ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, NOW() ) RETURNING * `,
      [
        user_id,
        title,
        category,
        budget_min ?? null,     // nullable if omitted
        budget_max ?? null,
        description ?? null,
        location ?? null,
        status,
      ]
    );

    const newRequest = result[0];

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle PUT Requests (TODO: rewrite to NEON)
// export async function PUT(req: NextRequest) {
//   try {
//     await initDB();
//     const { request_id, ...updateData } = await req.json();

//     const request = await Request.findByPk(request_id);
//     if (!request) {
//       return NextResponse.json(
//         { message: "Request not found" },
//         { status: 404 }
//       );
//     }

//     await request.update(updateData);
//     return NextResponse.json(request, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// 🟢 Handle DELETE Requests (TODO: rewrite to NEON)
// export async function DELETE(req: NextRequest) {
//   try {
//     await initDB();
//     const { request_id } = await req.json();

//     const requestToDelete = await Request.findByPk(request_id);
//     if (!requestToDelete) {
//       return NextResponse.json(
//         { message: "Request not found" },
//         { status: 404 }
//       );
//     }

//     await requestToDelete.destroy();
//     return NextResponse.json(
//       { message: "Request deleted successfully" },
//       { status: 204 }
//     );
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
