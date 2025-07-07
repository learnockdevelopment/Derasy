import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userData = await User.findById(user.id).select('-password');

    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        // Add more fields if needed
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user info:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
