// /api/applications/received/[id]/route.js
import { dbConnect } from '@/lib/dbConnect';
import Application from '@/models/Application';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.role !== 'school_owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    // Get IDs of schools the user owns
    const ownedSchools = await School.find({ 'ownership.owner': user.id }).select('_id');
    const ownedSchoolIds = ownedSchools.map((school) => school._id.toString());

    // Fetch the specific application
    const app = await Application.findById(id)
      .populate('parent', 'name email phone')
      .populate('child')
      .populate('school');

    if (!app) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Ensure the application belongs to one of the owned schools
    if (!ownedSchoolIds.includes(app.school._id.toString())) {
      return NextResponse.json({ message: 'Access denied: Not your school' }, { status: 403 });
    }

    return NextResponse.json(app);
  } catch (err) {
    console.error('❌ Error fetching single application:', err);
    return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
  }
}
