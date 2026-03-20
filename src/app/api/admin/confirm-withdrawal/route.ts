import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyUser } from '@/lib/wallet';

export async function POST(request: Request) {
  const body = await request.json();
  if (body.secret !== process.env.OWNER_CONFIRM_SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const withdrawal = await db.withdrawal.findUnique({ where: { id: body.id } });
  if (!withdrawal || withdrawal.status !== 'PENDING') return NextResponse.json({ ok: true });

  await db.$transaction(async (tx) => {
    await tx.withdrawal.update({ where: { id: withdrawal.id }, data: { status: 'PROCESSING', confirmedAt: new Date() } });
    await tx.user.update({ where: { id: withdrawal.userId }, data: { balance: { decrement: withdrawal.amount } } });
    await tx.walletLedger.create({
      data: {
        userId: withdrawal.userId,
        type: 'WITHDRAWAL',
        amount: -withdrawal.amount,
        description: 'Withdraw diproses owner',
        refId: withdrawal.requestId
      }
    });
  });

  await notifyUser(withdrawal.userId, 'Withdraw diproses', 'Penarikan saldo Anda sedang diproses. Dana akan segera dikirimkan ke akun pembayaran Anda. Terima kasih telah menggunakan NusaPay.');
  return NextResponse.json({ ok: true });
}
