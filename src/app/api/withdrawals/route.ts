import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatRupiah, generateRef } from '@/lib/utils';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const amount = Number(formData.get('amount') || 0);
  const payoutMethod = String(formData.get('payoutMethod') || '');
  const payoutAccountName = String(formData.get('payoutAccountName') || '');
  const payoutAccountNo = String(formData.get('payoutAccountNo') || '');
  const feeAdmin = Math.ceil(amount * 0.01);

  if (user.balance < amount) return NextResponse.redirect(new URL('/dashboard?error=saldo', request.url));

  const withdrawal = await db.withdrawal.create({
    data: {
      requestId: generateRef('WD'),
      amount,
      feeAdmin,
      payoutMethod,
      payoutAccountName,
      payoutAccountNo,
      userId: user.id
    }
  });

  await sendTelegramMessage(
    `💸 <b>Request Withdraw Baru</b>\nUser: ${user.username}\nTujuan: ${payoutMethod} - ${payoutAccountNo}\nAtas nama: ${payoutAccountName}\nJumlah: ${formatRupiah(amount)}\nFee: ${formatRupiah(feeAdmin)}`,
    [[{ text: 'Konfirmasi Withdraw', callback_data: `confirm_withdraw:${withdrawal.id}` }]]
  );

  return NextResponse.redirect(new URL('/dashboard?withdraw=pending', request.url));
}
