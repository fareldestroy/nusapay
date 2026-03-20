import 'dotenv/config';
// @ts-ignore
import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/lib/db';
import { notifyUser } from '@/lib/wallet';
import { formatRupiah } from '@/lib/utils';

const token = process.env.TELEGRAM_BOT_TOKEN;
const ownerId = process.env.TELEGRAM_OWNER_ID;

if (!token || !ownerId) {
  throw new Error('Telegram bot belum dikonfigurasi. Isi TELEGRAM_BOT_TOKEN dan TELEGRAM_OWNER_ID.');
}

const bot = new TelegramBot(token, { polling: true });

function ownerOnly(chatId: number) {
  return String(chatId) === String(ownerId);
}

bot.onText(/\/listpengguna/, async (msg) => {
  if (!ownerOnly(msg.chat.id)) return;
  const users = await db.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  const text = users.map((u, i) => `${i + 1}. ${u.username} — ${u.email} — ${formatRupiah(u.balance)}`).join('\n') || 'Belum ada pengguna';
  await bot.sendMessage(msg.chat.id, text);
});

bot.onText(/\/addsaldo (\S+) (\d+)/, async (msg, match) => {
  if (!ownerOnly(msg.chat.id) || !match) return;
  const [, username, amount] = match;
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return bot.sendMessage(msg.chat.id, 'User tidak ditemukan');
  const nominal = Number(amount);
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { balance: { increment: nominal } } }),
    db.walletLedger.create({ data: { userId: user.id, type: 'MANUAL_CREDIT', amount: nominal, description: 'Saldo manual dari owner' } })
  ]);
  await notifyUser(user.id, 'Saldo ditambahkan', `Owner menambahkan saldo sebesar ${formatRupiah(nominal)} ke akun Anda.`);
  await bot.sendMessage(msg.chat.id, 'Saldo berhasil ditambahkan.');
});

bot.onText(/\/sendnotify (\S+) (.+)/, async (msg, match) => {
  if (!ownerOnly(msg.chat.id) || !match) return;
  const [, target, text] = match;
  if (target === 'semua') {
    const users = await db.user.findMany({ select: { id: true } });
    await db.notification.createMany({ data: users.map((u) => ({ userId: u.id, title: 'Broadcast owner', message: text })) });
    return bot.sendMessage(msg.chat.id, 'Notifikasi dikirim ke semua pengguna.');
  }
  const user = await db.user.findUnique({ where: { username: target } });
  if (!user) return bot.sendMessage(msg.chat.id, 'User tidak ditemukan');
  await notifyUser(user.id, 'Pesan dari owner', text);
  await bot.sendMessage(msg.chat.id, `Notifikasi dikirim ke ${target}.`);
});

bot.onText(/\/maintenance (on|off) ?(.*)/, async (msg, match) => {
  if (!ownerOnly(msg.chat.id) || !match) return;
  const enabled = match[1] === 'on';
  const message = match[2] || 'Kami sedang melakukan peningkatan sistem. Mohon tunggu beberapa saat.';
  await db.systemConfig.upsert({
    where: { key: 'maintenance' },
    update: { value: JSON.stringify({ enabled, message }) },
    create: { key: 'maintenance', value: JSON.stringify({ enabled, message }) }
  });
  await bot.sendMessage(msg.chat.id, `Maintenance ${enabled ? 'diaktifkan' : 'dimatikan'}.`);
});

bot.on('callback_query', async (query) => {
  if (!query.data || !query.message || !ownerOnly(query.message.chat.id)) return;

  const [action, id] = query.data.split(':');

  if (action === 'confirm_deposit') {
    await fetch(`${process.env.APP_URL}/api/admin/confirm-deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, secret: process.env.OWNER_CONFIRM_SECRET })
    });
    await bot.answerCallbackQuery(query.id, { text: 'Deposit dikonfirmasi.' });
  }

  if (action === 'confirm_withdraw') {
    await fetch(`${process.env.APP_URL}/api/admin/confirm-withdrawal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, secret: process.env.OWNER_CONFIRM_SECRET })
    });
    await bot.answerCallbackQuery(query.id, { text: 'Withdraw diproses.' });
  }
});

console.log('Bot Telegram NusaPay aktif');
