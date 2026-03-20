import { db } from '@/lib/db';
import { LedgerType, Prisma } from '@prisma/client';

export async function addBalanceTx(tx: Prisma.TransactionClient, params: {
  userId: string;
  amount: number;
  type: LedgerType;
  description: string;
  refId?: string;
}) {
  await tx.user.update({
    where: { id: params.userId },
    data: { balance: { increment: params.amount } }
  });

  await tx.walletLedger.create({
    data: params
  });
}

export async function notifyUser(userId: string, title: string, message: string) {
  await db.notification.create({
    data: { userId, title, message }
  });
}
