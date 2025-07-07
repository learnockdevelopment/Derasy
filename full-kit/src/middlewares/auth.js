// middleware/auth.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function authenticate(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is in .env
    return user;
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
}
