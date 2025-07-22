import { dbConnect } from '@/lib/dbConnect';
import StudentIdCardRequest from '@/models/StudentCard';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    console.log('📥 GET /api/schools/my/:id/card-request/:requestId');

    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id: schoolId, requestId } = params;

    if (!schoolId || schoolId.length !== 24 || !requestId || requestId.length !== 24) {
      return NextResponse.json({ message: 'Invalid ID(s)' }, { status: 400 });
    }

    const request = await StudentIdCardRequest.findOne({
      _id: requestId,
    })
      .populate('school')
      .populate('student');

    if (!request) {
      return NextResponse.json({ message: 'Card request not found' }, { status: 404 });
    }

    return NextResponse.json({ request });
  } catch (error) {
    console.error('🔥 Error fetching single request:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
