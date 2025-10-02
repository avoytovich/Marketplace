// import { NextResponse } from "next/server";
// import Proposal from "../../../../models/Proposals";
// import sequelize from "../../../../sequelize";

// // Ensure DB is synced (optional for production)
// async function initDB() {
//   await sequelize.sync();
// }

// // 🟢 Handle GET Requests
// export async function GET() {
//   try {
//     await initDB();
//     const proposals = await Proposal.findAll({
//       include: ["request", "seller", "transactions", "messages"], // Include associated data
//     });
//     return NextResponse.json(proposals, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // 🟢 Handle POST Requests
// export async function POST(req: Request) {
//   try {
//     await initDB();
//     const body = await req.json();
//     const newProposal = await Proposal.create(body);
//     return NextResponse.json(newProposal, { status: 201 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // 🟢 Handle PUT Requests
// export async function PUT(req: Request) {
//   try {
//     await initDB();
//     const { proposal_id, ...updateData } = await req.json();

//     const proposal = await Proposal.findByPk(proposal_id);
//     if (!proposal) {
//       return NextResponse.json(
//         { message: "Proposal not found" },
//         { status: 404 }
//       );
//     }

//     await proposal.update(updateData);
//     return NextResponse.json(proposal, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // 🟢 Handle DELETE Requests
// export async function DELETE(req: Request) {
//   try {
//     await initDB();
//     const { proposal_id } = await req.json();

//     const proposalToDelete = await Proposal.findByPk(proposal_id);
//     if (!proposalToDelete) {
//       return NextResponse.json(
//         { message: "Proposal not found" },
//         { status: 404 }
//       );
//     }

//     await proposalToDelete.destroy();
//     return NextResponse.json(
//       { message: "Proposal deleted successfully" },
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
