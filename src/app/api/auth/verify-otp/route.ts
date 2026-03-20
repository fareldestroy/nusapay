import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '');
  const otp = String(formData.get('otp') || '');

  const record = await db.otpCode.findFirst({
    where: { email, code: otp, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  });

  if (!record || !record.userId) return NextResponse.redirect(new URL('/register?error=otp', request.url));

  await db.$transaction([
    db.otpCode.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    db.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } })
  ]);

  return NextResponse.redirect(new URL('/login?verified=1', request.url));
}
