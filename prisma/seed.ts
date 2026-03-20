// @ts-ignore
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Owner123!!', 10);

  await prisma.user.upsert({
    where: { email: 'owner@nusapay.biz.id' },
    update: {},
    create: {
      email: 'owner@nusapay.biz.id',
      username: 'owner',
      passwordHash: hash,
      role: 'OWNER',
      emailVerifiedAt: new Date(),
      apiKey: crypto.randomUUID().replace(/-/g, '')
    }
  });

  await prisma.systemConfig.upsert({
    where: { key: 'maintenance' },
    update: {},
    create: {
      key: 'maintenance',
      value: JSON.stringify({ enabled: false, message: '' })
    }
  });
}

main().finally(async () => prisma.$disconnect());
