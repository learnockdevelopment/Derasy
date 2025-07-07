// === app/api/logs/my/route.js ===
import { dbConnect } from '@/lib/dbConnect';
import { authenticate } from '@/middlewares/auth';
import Log from '@/models/Log';

export async function GET(req) {
  try {
    await dbConnect();
    const user = await authenticate(req);

    if (!user || user.message) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const logs = await Log.find({ user: user.id })
      .sort({ timestamp: -1 })
      .limit(50); // latest 50 logs

    return Response.json({ logs });
  } catch (err) {
    console.error('❌ Failed to fetch logs:', err);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
