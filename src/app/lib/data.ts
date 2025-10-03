import { neon } from '@neondatabase/serverless';

// Create the table (run once, e.g., in a migration script)
export async function createUsersTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'user', 'admin')),
      is_activate BOOLEAN DEFAULT FALSE,
      profile_picture BYTEA,
      bio TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Create the "requests" table in Neon
export async function createRequestsTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(` 
    CREATE TABLE IF NOT EXISTS requests (
      request_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      budget_min INTEGER,
      budget_max INTEGER,
      description TEXT,
      location TEXT,
      status TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Create the "proposals" table in Neon
export async function createProposalsTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS proposals (
      proposal_id SERIAL PRIMARY KEY,
      request_id INTEGER NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,
      seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      price DECIMAL(10,2) NOT NULL,
      estimated_time TEXT NOT NULL,
      message TEXT,
      portfolio_url TEXT,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Create the "files" table with FK to requests
export async function createFilesTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS files (
      file_id SERIAL PRIMARY KEY,
      request_id INTEGER NOT NULL REFERENCES requests(request_id) ON DELETE CASCADE,
      file_url TEXT NOT NULL,
      uploaded_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Create the "reviews" table with FK to users (from and to)
export async function createReviewsTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      review_id SERIAL PRIMARY KEY,
      from_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      to_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Create the "messages" table with FKs to users and proposals
export async function createMessagesTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS messages (
      message_id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      receiver_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      proposal_id INTEGER NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      read_status BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Create the "transactions" table with FKs to proposals and users
export async function createTransactionsTable() {
  'use server';
  const sql = neon(`${process.env.DATABASE_DATABASE_URL}`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id SERIAL PRIMARY KEY,
      proposal_id INTEGER NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE,
      buyer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      amount DECIMAL(10,2) NOT NULL,
      payment_status TEXT NOT NULL, -- e.g. 'pending', 'completed', 'failed'
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
