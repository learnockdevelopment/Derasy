// middlewares/logger.js
import { createLog } from '@/lib/logger'; // See Step 2 below
import jwt from 'jsonwebtoken';

export function withLogging(handler) {
  return async (req) => {
    const start = Date.now();
    let userId = null;

    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded?.id;
      } catch (err) {
        console.warn('⚠️ Logging middleware: Invalid token');
      }
    }

    const res = await handler(req);
    const duration = Date.now() - start;

    await createLog({
      user: userId,
      endpoint: req.url,
      method: req.method,
      status: res.status,
      duration,
      timestamp: new Date(),
    });

    return res;
  };
}
