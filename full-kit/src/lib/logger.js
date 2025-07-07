// lib/logger.js
import Log from '@/models/Log';
import { dbConnect } from './dbConnect';

export async function createLog({ level = 'info', message, meta = {}, user = null, ip = '', endpoint = '' }) {
  try {
    await dbConnect();
    await Log.create({ level, message, meta, user, ip, endpoint });
  } catch (err) {
    console.error('Logging failed:', err);
  }
}
