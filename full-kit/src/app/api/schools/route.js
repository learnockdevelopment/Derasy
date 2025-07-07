// === app/api/schools/route.js ===
import { dbConnect } from '@/lib/dbConnect';
import School from '@/models/School';
import { authenticate } from '@/middleware/auth';

export async function POST(req) {
  await dbConnect();
  const user = await authenticate(req);
  if (!user || user.role !== 'school_owner') return user;

  const data = await req.json();
  const school = await School.create({ ...data, ownership: { owner: user.id } });
  return Response.json(school);
}

export async function GET() {
  await dbConnect();
  const schools = await School.find();
  return Response.json(schools);
}