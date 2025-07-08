import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { authenticate } from '@/middlewares/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const authUser = await authenticate(req);

    // Only allow admins to create users
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'parent')) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { name, email, phone, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!["school_owner", "moderator", "admin"].includes(role)) {
      return Response.json({ message: 'Invalid role' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      emailVerified: true
    });

    return Response.json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    return Response.json({ message: 'Internal server error', error: err.message }, { status: 500 });
  }
}
