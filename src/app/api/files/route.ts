// import { NextResponse, NextRequest } from "next/server";
// import File from "../../../../models/Files";
// import sequelize from "../../../../sequelize";

// // Ensure DB is synced (optional for production)
// async function initDB() {
//   await sequelize.sync();
// }

// // 🟢 Handle GET Requests
// export async function GET() {
//   try {
//     await initDB();
//     const files = await File.findAll({
//       include: ["request"], // Include associated request data
//     });
//     return NextResponse.json(files, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // 🟢 Handle POST Requests
// export async function POST(req: NextRequest) {
//   try {
//     await initDB();
//     const body = await req.json();
//     const newFile = await File.create({
//       ...body,
//       uploaded_at: new Date(), // Set current timestamp
//     });
//     return NextResponse.json(newFile, { status: 201 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // 🟢 Handle PUT Requests
// export async function PUT(req: NextRequest) {
//   try {
//     await initDB();
//     const { file_id, ...updateData } = await req.json();

//     const file = await File.findByPk(file_id);
//     if (!file) {
//       return NextResponse.json({ message: "File not found" }, { status: 404 });
//     }

//     await file.update(updateData);
//     return NextResponse.json(file, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // 🟢 Handle DELETE Requests
// export async function DELETE(req: NextRequest) {
//   try {
//     await initDB();
//     const { file_id } = await req.json();

//     const fileToDelete = await File.findByPk(file_id);
//     if (!fileToDelete) {
//       return NextResponse.json({ message: "File not found" }, { status: 404 });
//     }

//     await fileToDelete.destroy();
//     return NextResponse.json(
//       { message: "File deleted successfully" },
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

export {};
