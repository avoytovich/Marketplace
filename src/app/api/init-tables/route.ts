import { NextResponse } from 'next/server';
import {
    createUsersTable,
    createRequestsTable,
    createProposalsTable,
    createFilesTable,
    createReviewsTable,
    createMessagesTable,
    createTransactionsTable,
} from '../../lib/data';

export async function GET() {
  await createUsersTable();
  await createRequestsTable();
  await createProposalsTable();
  await createFilesTable();
  await createReviewsTable();
  await createMessagesTable();
  await createTransactionsTable();
  return NextResponse.json({ status: 'Tables created or already exists.' });
}
