import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    console.log('📡 Incoming request to /api/schools/:id');

    // 1. Connect to DB
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    // 2. Authenticate user
    const user = await authenticate(req);
    console.log('👤 Authenticated user:', user?.id || 'No user');

    if (!user || user.message) {
      console.warn('❌ Unauthorized access');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // 3. Extract school ID
    const { id } = params;
    if (!id || id.length !== 24) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    // 4. Find school by ID (with populated owner + moderators)
    const school = await School.findById(id)
      .populate('ownership.owner', 'fullName email')
      .populate('ownership.moderators', 'fullName email')
      .lean();

    if (!school) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    console.log(`✅ Found school "${school.name}"`);

    return NextResponse.json({ school });
  } catch (error) {
    console.error('❌ Error fetching school:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
