// app/api/schools/change-ownership/route.js
import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middlewares/auth';

export async function PUT(req) {
  await dbConnect();
  const user = await authenticate(req);
  if (!user) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { schoolIds } = await req.json();
  if (!Array.isArray(schoolIds)) {
    return Response.json({ message: 'Invalid data' }, { status: 400 });
  }

  try {
    // Remove ownership from previously owned schools
    await School.updateMany(
      { 'ownership.owner': user.id },
      { $unset: { 'ownership.owner': "" } }
    );

    // Assign ownership to selected schools
    await School.updateMany(
      { _id: { $in: schoolIds } },
      { $set: { 'ownership.owner': user.id } }
    );

    return Response.json({ message: 'Ownership updated' });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
