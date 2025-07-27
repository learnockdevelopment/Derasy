import { dbConnect } from '@/lib/dbConnect';
import StudentIdCardRequest from '@/models/StudentCard';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';
import School from '@/models/School';

export async function POST(req, { params }) {
  try {
    console.log('📨 Incoming POST request to /api/schools/my/:id/card-request');

    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      console.warn('❌ Unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id: schoolId } = params;
    if (!schoolId || schoolId.length !== 24) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    const form = await req.formData();
    const fieldsRaw = form.get('fields');
    const fields = JSON.parse(fieldsRaw);
    console.log('📝 Received fields:', fields);

    if (!Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json({ message: 'Fields are required' }, { status: 422 });
    }

    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    // 🔍 Extract customId from fields if it exists
    const customIdField = fields.find(f => f.key === 'customId');
    const customId = customIdField?.value?.trim() || null;

    // ✅ Validate customId against school's trusted IDs
    if (school.trustedIds && Array.isArray(school.trustedIds)) {
      if (customId && !school.trustedIds.includes(customId)) {
        return NextResponse.json({
          message: `The provided national ID (${customId}) is not authorized for this school.`,
        }, { status: 403 });
      }
    }

    // ❌ Remove customId field from fields array to avoid duplication
    const filteredFields = fields.filter(f => f.key !== 'customId');

    // 🔍 Extract photo file if a field has type "photo"
    const photoField = fields.find(f => f.key && f.type === 'photo');
    let photoFile = null;

    if (photoField) {
      photoFile = form.get(photoField.value);
      console.log('📸 Received photo:', photoFile?.name);
    }

    // 📝 Create the card request document
    const cardRequest = new StudentIdCardRequest({
      school: schoolId,
      student: user.id,
      fields: filteredFields,
      customId,
      photoUrl: null, // TODO: Handle photo upload if needed
    });

    await cardRequest.save();
    console.log('✅ Student ID card request saved');

    return NextResponse.json({ message: 'Request submitted successfully', cardRequest });
  } catch (error) {
    console.error('🔥 Error submitting card request:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    console.log('📥 Incoming GET request to /api/schools/my/:id/card-request');

    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      console.warn('❌ Unauthorized');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id: schoolId } = params;
    if (!schoolId || schoolId.length !== 24) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    const requests = await StudentIdCardRequest.find({
      school: schoolId,
      student: user.id,
    })
      .populate('school')
      .populate('student')
      .sort({ createdAt: -1 });

    console.log(`📄 Found ${requests.length} card requests for student ${user.id}`);

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('🔥 Error fetching card requests:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
