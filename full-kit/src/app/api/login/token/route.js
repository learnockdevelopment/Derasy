import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { session } = await req.json();
  console.log('Session data:', session);
  const token = jwt.sign(
    { id: session.user.id, role: session.user.role }, // You'll need to get user data from session
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return Response.json({
    message: 'Token generated successfully',
    token,
  }, { status: 200 });
}