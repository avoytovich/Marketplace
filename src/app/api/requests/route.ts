import { NextResponse, NextRequest } from "next/server";
import Request from "../../../../models/Requests";
import sequelize from "../../../../sequelize";

// Ensure DB is synced (optional for production)
async function initDB() {
  await sequelize.sync();
}

// 🟢 Handle GET Requests
export async function GET() {
  try {
    await initDB();
    const requests = await Request.findAll({
      include: ["user", "files", "proposals"], // Include associated data
    });
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle POST Requests
export async function POST(req: NextRequest) {
  try {
    await initDB();
    const body = await req.json();
    const newRequest = await Request.create(body);
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle PUT Requests
export async function PUT(req: NextRequest) {
  try {
    await initDB();
    const { request_id, ...updateData } = await req.json();

    const request = await Request.findByPk(request_id);
    if (!request) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    await request.update(updateData);
    return NextResponse.json(request, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 Handle DELETE Requests
export async function DELETE(req: NextRequest) {
  try {
    await initDB();
    const { request_id } = await req.json();

    const requestToDelete = await Request.findByPk(request_id);
    if (!requestToDelete) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    await requestToDelete.destroy();
    return NextResponse.json(
      { message: "Request deleted successfully" },
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
