import { dbConnect } from '@/lib/dbConnect';
import Application from '@/models/Application';
import { authenticate } from '@/middleware/auth';

export async function POST(req) {
  await dbConnect();
  const user = await authenticate(req);
  if (!user || user.role !== 'parent') return user;

  const data = await req.json();
  const app = await Application.create({ ...data, parent: user.id });
  return Response.json(app);
}

export async function GET(req) {
  await dbConnect();
  const user = await authenticate(req);
  if (!user) return user;

  const apps = await Application.find({ parent: user.id }).populate('child').populate('school');
  return Response.json(apps);
}