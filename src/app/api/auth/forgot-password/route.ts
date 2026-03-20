import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/utils';
import { sendEmail } from '@/lib/email';

function generateTempPassword() {
  return Math.random().toString(36).slice(-10) + 'A1!';
}

export async function POST(request: Request) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const formData = await request.formData();
    const email = String(formData.get('email') || '');

    const user = await db.user.findUnique({
      where: { email }
    });

    if (user) {
      const tempPassword = generateTempPassword();

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await hashPassword(tempPassword),
          tempPassword: true
        }
      });

      await sendEmail(
        email,
        'Password sementara NusaPay',
        `<p>Password sementara Anda: <b>${tempPassword}</b></p><p>Silakan login lalu ganti melalui Pengaturan.</p>`
      );
    }

    return NextResponse.redirect(`${baseUrl}/login?reset=sent`);

  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/login?error=server`);
  }
}
