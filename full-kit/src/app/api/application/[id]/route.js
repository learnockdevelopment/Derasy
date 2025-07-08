import { dbConnect } from '@/lib/dbConnect';
import Application from '@/models/Application';
import { authenticate } from '@/middlewares/auth';

export async function GET(req, { params }) {
  await dbConnect();
  const user = await authenticate(req);
  if (!user || user.role !== 'parent') return user;

  const { id } = params;

  try {
    const app = await Application.findOne({ _id: id, parent: user.id })
      .populate('child')
      .populate('school');

    if (!app) {
      return Response.json({ message: 'لم يتم العثور على الطلب' }, { status: 404 });
    }

    return Response.json(app);
  } catch (err) {
    console.error('Error fetching single application:', err);
    return Response.json({ message: 'خطأ في تحميل الطلب' }, { status: 500 });
  }
}
