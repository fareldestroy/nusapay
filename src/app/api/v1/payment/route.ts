import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addBalanceTx, notifyUser } from '@/lib/wallet';

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.findUnique({ where: { apiKey: body.apikey } });

  if (!user) return NextResponse.json({ error: 'API key tidak valid' }, { status: 401 });
  if (!body.trxId || !body.amount) return NextResponse.json({ error: 'trxId dan amount wajib diisi' }, { status: 400 });

  await db.$transaction(async (tx) => {
    await addBalanceTx(tx, {
      userId: user.id,
      amount: Number(body.amount),
      type: 'PAYMENT',
      description: `Auto payment ${body.trxId}`,
      refId: body.trxId
    });
  });

  await notifyUser(user.id, 'Pembayaran otomatis berhasil', `Transaksi ${body.trxId} berhasil diproses dan saldo Anda bertambah.`);
  return NextResponse.json({ success: true, trxId: body.trxId, balance: user.balance + Number(body.amount) });
}
