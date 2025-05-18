import { NextResponse } from "next/server";
import Transaction from "../../../../models/Transactions";
import sequelize from "../../../../sequelize";

// Ensure DB is synced (optional for production)
async function initDB() {
  await sequelize.sync();
}

// 🟢 Handle GET Requests
export async function GET() {
  try {
    await initDB();
    const transactions = await Transaction.findAll({
      include: ["proposal", "buyer", "seller"], // Include associated data
    });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle POST Requests
export async function POST(req: Request) {
  try {
    await initDB();
    const body = await req.json();

    // Validate required fields
    if (
      !body.proposal_id ||
      !body.buyer_id ||
      !body.seller_id ||
      !body.amount
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      ...body,
      payment_status: body.payment_status || "pending", // Default status
      created_at: new Date(), // Set current timestamp
    });
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle PUT Requests
export async function PUT(req: Request) {
  try {
    await initDB();
    const { transaction_id, ...updateData } = await req.json();

    const transaction = await Transaction.findByPk(transaction_id);
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    // Validate payment status if it's being updated
    if (
      updateData.payment_status &&
      !["pending", "completed", "failed"].includes(updateData.payment_status)
    ) {
      return NextResponse.json(
        { message: "Invalid payment status" },
        { status: 400 }
      );
    }

    await transaction.update(updateData);
    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle DELETE Requests
export async function DELETE(req: Request) {
  try {
    await initDB();
    const { transaction_id } = await req.json();

    const transactionToDelete = await Transaction.findByPk(transaction_id);
    if (!transactionToDelete) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    await transactionToDelete.destroy();
    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
