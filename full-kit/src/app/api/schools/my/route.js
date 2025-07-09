import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    console.log('📡 Incoming request to /api/schools/my');

    // Step 1: Connect to the database
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    // Step 2: Authenticate the user
    const user = await authenticate(req);
    console.log('👤 Authenticated user:', user.id || 'No user');

    if (!user || user.message) {
      console.warn('❌ Unauthorized access');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Step 3: Find schools owned by the authenticated user
    const schools = await School.find({ 'ownership.owner': user.id })
      .populate('ownership.owner', 'fullName email')
      .populate('ownership.moderators', 'fullName email')
      .lean();

    console.log(`🏫 Found ${schools.length} school(s) owned by user ${user.email}`);

    // Step 4: Return the schools
    return NextResponse.json({ schools });
  } catch (error) {
    console.error('❌ Error fetching owned schools:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}