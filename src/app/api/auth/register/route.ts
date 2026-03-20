import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { generateApiKey, generateOtp, hashPassword } from '@/lib/utils';
import { sendEmail } from '@/lib/email';

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = schema.parse(Object.fromEntries(formData));

  const existing = await db.user.findFirst({
    where: { OR: [{ email: payload.email }, { username: payload.username }] }
  });

  if (existing) return NextResponse.redirect(new URL('/register?error=exists', request.url));

  const passwordHash = await hashPassword(payload.password);
  const user = await db.user.create({
    data: {
      email: payload.email,
      username: payload.username,
      passwordHash,
      apiKey: generateApiKey()
    }
  });

  const code = generateOtp();
  await db.otpCode.create({
    data: {
      email: payload.email,
      code,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }
  });

  await sendEmail(payload.email, 'OTP Verifikasi NusaPay', `<p>Kode OTP Anda: <b>${code}</b></p><p>Berlaku 10 menit.</p>`);
  return NextResponse.redirect(new URL('/register?success=otp-sent', request.url));
}
