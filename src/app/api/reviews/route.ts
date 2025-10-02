// import { NextResponse } from "next/server";
// import Review from "../../../../models/Reviews";
// import sequelize from "../../../../sequelize";

// Ensure DB is synced (optional for production)
// async function initDB() {
//   await sequelize.sync();
// }

// 🟢 Handle GET Requests
// export async function GET() {
//   try {
//     await initDB();
//     const reviews = await Review.findAll({
//       include: ["fromUser", "toUser"], // Include associated user data
//     });
//     return NextResponse.json(reviews, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// 🟢 Handle POST Requests
// export async function POST(req: Request) {
//   try {
//     await initDB();
//     const body = await req.json();

//     // Validate rating is between 1-5
//     if (body.rating < 1 || body.rating > 5) {
//       return NextResponse.json(
//         { message: "Rating must be between 1 and 5" },
//         { status: 400 }
//       );
//     }

//     const newReview = await Review.create(body);
//     return NextResponse.json(newReview, { status: 201 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// 🟢 Handle PUT Requests
// export async function PUT(req: Request) {
//   try {
//     await initDB();
//     const { review_id, ...updateData } = await req.json();

//     // Validate rating if it's being updated
//     if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
//       return NextResponse.json(
//         { message: "Rating must be between 1 and 5" },
//         { status: 400 }
//       );
//     }

//     const review = await Review.findByPk(review_id);
//     if (!review) {
//       return NextResponse.json(
//         { message: "Review not found" },
//         { status: 404 }
//       );
//     }

//     await review.update(updateData);
//     return NextResponse.json(review, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// 🟢 Handle DELETE Requests
// export async function DELETE(req: Request) {
//   try {
//     await initDB();
//     const { review_id } = await req.json();

//     const reviewToDelete = await Review.findByPk(review_id);
//     if (!reviewToDelete) {
//       return NextResponse.json(
//         { message: "Review not found" },
//         { status: 404 }
//       );
//     }

//     await reviewToDelete.destroy();
//     return NextResponse.json(
//       { message: "Review deleted successfully" },
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
