import { NextResponse } from "next/server";
import Message from "../../../../models/Messages";
import sequelize from "../../../../sequelize";

// Ensure DB is synced (optional for production)
async function initDB() {
  await sequelize.sync();
}

// 🟢 Handle GET Requests
export async function GET() {
  try {
    await initDB();
    const messages = await Message.findAll({
      include: ["sender", "receiver", "proposal"], // Include associated data
    });
    return NextResponse.json(messages, { status: 200 });
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
    const newMessage = await Message.create({
      ...body,
      read_status: false, // Set default read status
      created_at: new Date(), // Set current timestamp
    });
    return NextResponse.json(newMessage, { status: 201 });
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
    const { message_id, ...updateData } = await req.json();

    const message = await Message.findByPk(message_id);
    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    await message.update(updateData);
    return NextResponse.json(message, { status: 200 });
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
    const { message_id } = await req.json();

    const messageToDelete = await Message.findByPk(message_id);
    if (!messageToDelete) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    await messageToDelete.destroy();
    return NextResponse.json(
      { message: "Message deleted successfully" },
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
