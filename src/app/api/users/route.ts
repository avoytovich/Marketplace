import { NextResponse } from 'next/server';
import User from '../../../../models/Users';
import sequelize from '../../../../sequelize'; // Import your sequelize instance

// Ensure DB is synced (optional for production)
async function initDB() {
  await sequelize.sync();
}

// 🟢 Handle GET Requests
export async function GET() {
  await initDB();
  const users = await User.findAll();
  return NextResponse.json(users, { status: 200 });
}

// 🟢 Handle POST Requests
export async function POST(req: Request) {
  try {
    await initDB();
    const body = await req.json(); // Extract JSON body
    const newUser = await User.create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 🟢 Handle PUT Requests
export async function PUT(req: Request) {
  try {
    await initDB();
    const { id, ...updateData } = await req.json();

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await user.update(updateData);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 🟢 Handle DELETE Requests
export async function DELETE(req: Request) {
  try {
    await initDB();
    const { userId } = await req.json();

    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await userToDelete.destroy();
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
