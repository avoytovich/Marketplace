import { NextResponse } from "next/server";
import { Pool } from "pg";
import { chat } from "@/lib/ollama";

const pool = new Pool({ connectionString: process.env.DATABASE_DATABASE_URL });

function extractJson(text: string) {
  const cleaned = (text || "")
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

// Safety guard: only SELECT or WITH, forbid multiple statements and DML
function validateReadOnlySql(sql: string) {
  const s = sql.trim();
  if (!/^(select|with)\b/i.test(s)) throw new Error("Only SELECT/WITH allowed.");
  const forbids = ["insert","update","delete","drop","truncate","alter","create","grant","revoke","comment","vacuum","analyze","call","execute"];
  const lower = s.toLowerCase();
  for (const kw of forbids) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(lower)) throw new Error(`Forbidden keyword: ${kw}`);
  }
  if (s.includes(";")) throw new Error("No semicolons.");
  return s;
}

const schema = `
Tables:
users(user_id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'user', 'admin')), is_activate BOOLEAN DEFAULT FALSE, profile_picture BYTEA, bio TEXT, created_at TIMESTAMP DEFAULT NOW())
requests(request_id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, title TEXT NOT NULL, category TEXT NOT NULL, budget_min INTEGER, budget_max INTEGER, description TEXT, location TEXT, status TEXT, created_at TIMESTAMP DEFAULT NOW())
proposals(proposal_id SERIAL PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE, seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, price DECIMAL(10,2) NOT NULL, estimated_time TEXT NOT NULL, message TEXT, portfolio_url TEXT, status TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())
files(file_id SERIAL PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE, file_url TEXT NOT NULL, uploaded_at TIMESTAMP DEFAULT NOW())
reviews(review_id SERIAL PRIMARY KEY, from_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, to_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), comment TEXT, created_at TIMESTAMP DEFAULT NOW())
messages(message_id SERIAL PRIMARY KEY, sender_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, receiver_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, proposal_id INTEGER NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE, message TEXT NOT NULL, read_status BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW())
transactions(transaction_id SERIAL PRIMARY KEY, proposal_id INTEGER NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE, buyer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, amount DECIMAL(10,2) NOT NULL, payment_status TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())
`;

export async function POST(req: Request) {
  const { question } = await req.json();

  const llmText = await chat({
    messages: [
      { role: "system", content:
        `You are a Postgres SQL assistant. Given user question and schema, produce ONE complete and valid read-only SQL query (SELECT, no DML/DDL, no semicolons), as JSON: {"sql":"...","explanation":"..."}. Ensure the query is properly formatted, includes all necessary clauses, and retrieves the results.
        Note: in proposals table we have seller_id which is the user_id who created the proposal. If the question is about finding proposals by a seller, you should filter by seller_id, not user_id. However, if the question is about finding requests created by a user, you should filter requests by user_id. Always use the correct field based on the context of the question. 

        IMPORTANT: 
        - If the question asks for "the proposal with the lowest price for each request" or "cheapest proposal per request", use DISTINCT ON as in the following template:
            SELECT DISTINCT ON (p.request_id) p.*
            FROM proposals p
            ORDER BY p.request_id, p.price ASC

        - If more than one proposal may have the same minimum price, it's ok to return any one; for *all* with the lowest price, use a subquery with MIN(price).

        - If the question asks for the user's name, email, and the proposal with the lowest price for each request, use:
            SELECT r.request_id,
            u.username,
            u.email,
            p.price
            FROM requests r
            JOIN (
                SELECT DISTINCT ON (request_id) proposal_id, request_id, price, seller_id
                FROM proposals
                ORDER BY request_id, price ASC
            ) p ON r.request_id = p.request_id
            JOIN users u ON p.seller_id = u.user_id
        `
      },
      { role: "user", content: `Schema:\n${schema}\n\nQuestion: ${question}` }
    ],
    temperature: 0.1
  });

  let sql = "";
  let explanation = "";
  try {
    const parsed = JSON.parse(extractJson(llmText));
    sql = String(parsed.sql ?? "");
    explanation = String(parsed.explanation ?? "");
  } catch {
    sql = llmText.trim();
    explanation = "Model returned raw SQL (not JSON).";
  }

  try {
    sql = validateReadOnlySql(sql);
    const result = await pool.query(sql);
    return NextResponse.json({
      question,
      sql,
      explanation,
      rowCount: result.rowCount,
      rows: result.rows
    });
  } catch (e: any) {
    return NextResponse.json({ question, sql, error: String(e?.message ?? e), explanation }, { status: 400 });
  }
}
