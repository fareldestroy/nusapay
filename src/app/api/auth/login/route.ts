import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signAuthToken } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const formData = await request.formData();
    const username = String(formData.get('username') || '');
    const password = String(formData.get('password') || '');

    const user = await db.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid`);
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.redirect(`${baseUrl}/login?error=verify`);
    }

    const ok = await comparePassword(password, user.passwordHash);

    if (!ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid`);
    }

    const token = await signAuthToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    cookies().set('nusapay_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.redirect(`${baseUrl}/dashboard`);

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/login?error=server`);
  }
}
