import { cookies } from 'next/headers';

export async function POST() {
  // Clear the token cookie
  cookies().set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0, // expires immediately
  });

  return Response.json({ message: 'Logged out successfully' });
}
