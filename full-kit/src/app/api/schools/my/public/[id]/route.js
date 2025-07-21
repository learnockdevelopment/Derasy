import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    console.log('📡 Incoming request to /api/schools/:id');

    await dbConnect();

    const { id } = params;
    if (!id || id.length !== 24) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    const school = await School.findById(id)
      .populate('ownership.owner', 'fullName email')
      .populate('ownership.moderators', 'fullName email')
      .lean();

    if (!school) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({ school });
  } catch (error) {
    console.error('❌ Error fetching school:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    console.log('🟡 [1] PUT request received for /api/schools/:id');

    // Step 1: Connect to database
    await dbConnect();
    console.log('✅ [2] Connected to MongoDB');

    // Step 2: Authenticate user
    const user = await authenticate(req);
    console.log('👤 [3] Authenticated user:', user?.id || 'Not Authenticated');

    if (!user || user.message) {
      console.warn('❌ [4] Unauthorized user');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Step 3: Extract school ID from params
    const { id } = params;
    console.log('🆔 [5] School ID:', id);

    if (!id || id.length !== 24) {
      console.warn('❌ [6] Invalid school ID');
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    // Step 4: Find the school
    const school = await School.findById(id);
    if (!school) {
      console.warn('❌ [7] School not found');
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }
    console.log('🏫 [8] School found:', school.name);

    // Step 5: Check if user is owner or moderator
    const isOwner = school.ownership.owner?.toString() === user.id;
    const isModerator = school.ownership.moderators?.some(
      (modId) => modId.toString() === user.id
    );
    console.log(`🛂 [9] Authorization: isOwner=${isOwner}, isModerator=${isModerator}`);

    if (!isOwner && !isModerator) {
      console.warn('🚫 [10] User is not authorized to update this school');
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Step 6: Parse incoming data
    const updatedData = await req.json();
    console.log('📦 [11] Received update data:', updatedData);

    // Step 7: Prevent updates to protected fields
    delete updatedData._id;
    delete updatedData.ownership;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;
    console.log('🧹 [12] Sanitized update data (protected fields removed)');

    // Step 8: Apply updates to school
    Object.assign(school, updatedData);
    console.log('📝 [13] Merged update data into school document');

    // Step 9: Save changes
    await school.save();
    console.log('💾 [14] School document saved successfully');

    // Step 10: Return success
    return NextResponse.json({ message: 'School updated', school });
  } catch (error) {
    console.error('🔥 [15] Error during PUT /api/schools/:id:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
