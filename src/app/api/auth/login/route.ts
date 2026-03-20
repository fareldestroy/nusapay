import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signAuthToken } from '@/lib/utils';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get('username') || '');
  const password = String(formData.get('password') || '');

  const user = await db.user.findUnique({ where: { username } });
  if (!user) return NextResponse.redirect(new URL('/login?error=invalid', request.url));
  if (!user.emailVerifiedAt) return NextResponse.redirect(new URL('/login?error=verify', request.url));

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return NextResponse.redirect(new URL('/login?error=invalid', request.url));

  const token = await signAuthToken({ userId: user.id, username: user.username, role: user.role });
  cookies().set('nusapay_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
