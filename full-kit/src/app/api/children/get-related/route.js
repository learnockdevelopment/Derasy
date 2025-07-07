import { dbConnect } from '@/lib/dbConnect';
import Child from '@/models/Child';
import { authenticate } from '@/middlewares/auth';

export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message || user.role !== 'parent') {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const children = await Child.find({ parent: user.id }).sort({ createdAt: -1 });

    return Response.json({ children }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching children:', error);
    return Response.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
