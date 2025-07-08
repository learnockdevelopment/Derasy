import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { dbConnect } from './dbConnect';

export async function getCurrentUser() {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    return user;
  } catch (err) {
    return null;
  }
}
