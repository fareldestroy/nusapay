import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatRupiah, generateRef } from '@/lib/utils';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const amount = Number(formData.get('amount') || 0);
  const note = String(formData.get('note') || '');

  const deposit = await db.deposit.create({
    data: {
      trxId: generateRef('DEP'),
      amount,
      note,
      userId: user.id
    }
  });

  await sendTelegramMessage(
    `📥 <b>Request Deposit Baru</b>\nUser: ${user.username}\nNominal: ${formatRupiah(amount)}\nTRX: ${deposit.trxId}`,
    [[{ text: 'Konfirmasi Deposit', callback_data: `confirm_deposit:${deposit.id}` }]]
  );

  return NextResponse.redirect(new URL('/dashboard?deposit=pending', request.url));
}
