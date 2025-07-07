// === app/api/test/route.js ===
import { dbConnect } from '@/lib/dbConnect';
import { authenticate } from '@/middlewares/auth';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    // Test DB connection
    await dbConnect();

    // Test JWT auth (optional, use a dummy token)
    const user = await authenticate(req);
    if (user?.message) return user; // authentication failed response

    // Test mongoose state
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'not connected';

    return Response.json({
      message: 'API is working and all systems are functional!',
      database: dbStatus,
      authenticatedUser: user
    });
  } catch (err) {
    return Response.json({ message: 'Error in test API', error: err.message }, { status: 500 });
  }
}