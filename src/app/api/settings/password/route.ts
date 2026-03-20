import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { comparePassword, hashPassword } from '@/lib/utils';

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const oldPassword = String(formData.get('oldPassword') || '');
  const newPassword = String(formData.get('newPassword') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (newPassword !== confirmPassword) return NextResponse.redirect(new URL('/settings?error=confirm', request.url));
  const ok = await comparePassword(oldPassword, user.passwordHash);
  if (!ok) return NextResponse.redirect(new URL('/settings?error=old', request.url));

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword), tempPassword: false }
  });

  return NextResponse.redirect(new URL('/settings?success=1', request.url));
}
