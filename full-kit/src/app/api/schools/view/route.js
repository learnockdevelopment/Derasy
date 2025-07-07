// === app/api/schools/route.js ===
import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const schools = await School.find()
      .populate('ownership.owner', 'fullName email') // Optional: show owner info
      .populate('ownership.moderators', 'fullName email') // Optional: show moderators info
      .lean();

    return NextResponse.json({ schools });
  } catch (error) {
    console.error('❌ Error fetching schools:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
