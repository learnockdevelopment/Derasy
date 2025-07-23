import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import StudentIdCardRequest from '@/models/StudentCard';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Find all schools where user is owner or moderator
    const schools = await School.find({
      $or: [
        { 'ownership.owner': user.id },
        { 'ownership.moderators': user.id },
      ],
    }).select('_id studentIdCardFields idCard');

    const schoolIds = schools.map((school) => school._id);

    if (schoolIds.length === 0) {
      return NextResponse.json({ requests: [], fields: [], school: null });
    }

    // Fetch all related student card requests
    const requests = await StudentIdCardRequest.find({
      school: { $in: schoolIds },
    })
      .populate('school')
      .populate('student')
      .lean();

    return NextResponse.json({
      requests,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Internal Server Error', error: err.message },
      { status: 500 }
    );
  }
}
