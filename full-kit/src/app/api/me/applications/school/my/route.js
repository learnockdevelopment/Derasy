// /api/applications/received.js
import { dbConnect } from '@/lib/dbConnect';
import Application from '@/models/Application';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';

export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.role !== 'school_owner') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Step 1: Get all school IDs owned by this user
    const ownedSchools = await School.find({ 'ownership.owner': user.id }).select('_id');
    const schoolIds = ownedSchools.map((s) => s._id);

    // Step 2: Fetch applications related to those schools
    const apps = await Application.find({
      school: { $in: schoolIds },
      status: { $ne: 'draft' }
    })
      .populate('parent', 'name email phone') // optionally show parent info
      .populate('child')
      .populate('school')
      .sort({ submittedAt: -1 });


    return Response.json({ applications: apps });
  } catch (err) {
    console.error('❌ Error fetching received applications:', err);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
