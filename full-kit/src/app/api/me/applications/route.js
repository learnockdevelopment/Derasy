// /api/applications/my.js
import { dbConnect } from '@/lib/dbConnect';
import Application from '@/models/Application';
import { authenticate } from '@/middlewares/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.role !== 'parent') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const apps = await Application.find({ parent: user.id })
      .populate('school')
      .populate('child')
      .sort({ submittedAt: -1 });

    return Response.json({ applications: apps });
  } catch (err) {
    console.error('Error fetching applications:', err);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
