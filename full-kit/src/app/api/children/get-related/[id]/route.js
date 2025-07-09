// src/app/api/children/[id]/route.js

import { dbConnect } from '@/lib/dbConnect';
import Child from '@/models/Child';
import { authenticate } from '@/middlewares/auth';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message || user.role !== 'parent') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    const child = await Child.findOne({ _id: id, parent: user.id });

    if (!child) {
      return Response.json({ message: 'Child not found' }, { status: 404 });
    }

    return Response.json({ child }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching child:', error);
    return Response.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
