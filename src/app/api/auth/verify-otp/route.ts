import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const formData = await request.formData();
    const email = String(formData.get('email') || '');
    const otp = String(formData.get('otp') || '');

    const record = await db.otpCode.findFirst({
      where: {
        email,
        code: otp,
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!record || !record.userId) {
      return NextResponse.redirect(`${baseUrl}/register?error=otp`);
    }

    await db.$transaction([
      db.otpCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() }
      }),
      db.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() }
      })
    ]);

    return NextResponse.redirect(`${baseUrl}/login?verified=1`);

  } catch (error) {
    console.error('VERIFY OTP ERROR:', error);

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/register?error=server`);
  }
}
