import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addBalanceTx, notifyUser } from '@/lib/wallet';

export async function POST(request: Request) {
  const body = await request.json();
  if (body.secret !== process.env.OWNER_CONFIRM_SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const deposit = await db.deposit.findUnique({ where: { id: body.id } });
  if (!deposit || deposit.status !== 'PENDING') return NextResponse.json({ ok: true });

  await db.$transaction(async (tx) => {
    await tx.deposit.update({ where: { id: deposit.id }, data: { status: 'CONFIRMED', confirmedAt: new Date() } });
    await addBalanceTx(tx, { userId: deposit.userId, amount: deposit.amount, type: 'DEPOSIT', description: 'Deposit terkonfirmasi', refId: deposit.trxId });
  });

  await notifyUser(deposit.userId, 'Deposit dikonfirmasi', `Deposit Anda telah berhasil dikonfirmasi. Saldo sejumlah ${deposit.amount} telah ditambahkan ke akun NusaPay Anda. Selamat bertransaksi!`);
  return NextResponse.json({ ok: true });
}
