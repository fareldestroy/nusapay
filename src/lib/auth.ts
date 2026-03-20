import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyAuthToken } from '@/lib/utils';

export async function getCurrentUser() {
  const token = cookies().get('nusapay_session')?.value;
  if (!token) return null;

  try {
    const payload = await verifyAuthToken(token);
    return db.user.findUnique({ where: { id: String(payload.userId) } });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}
