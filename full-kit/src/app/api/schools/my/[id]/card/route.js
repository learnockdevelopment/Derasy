import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';

// GET single school
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

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
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// PUT to update idCardFields
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    if (!id || id.length !== 24) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    const body = await req.json();
    const { studentIdCardFields } = body;
    const idCardFields = studentIdCardFields || [];
console.log(body)
    if (!Array.isArray(idCardFields)) {
      return NextResponse.json({ message: 'idCardFields must be an array' }, { status: 400 });
    }

    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    // Optional: Only allow owner/moderator to update
    const isOwner = school.ownership.owner?.toString() === user.id;
    const isModerator = school.ownership.moderators?.some(
      (mod) => mod.toString() === user.id
    );
    school.studentIdCardFields = idCardFields;
    await school.save();

    return NextResponse.json({ message: 'Fields updated successfully', school });

  } catch (error) {
    console.log('Error updating school:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error },
      { status: 500 }
    );
  }
}
