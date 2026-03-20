import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { formatRupiah } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const notifications = user ? await db.notification.findMany({ where: { userId: user.id }, take: 5, orderBy: { createdAt: 'desc' } }) : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="card space-y-6">
          <div>
            <p className="text-sm text-slate-500">Ringkasan akun</p>
            <h1 className="mt-2 text-4xl font-bold">Dashboard NusaPay</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-300">Saldo</p>
              <p className="mt-3 text-3xl font-black">{formatRupiah(user?.balance ?? 0)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">API Key</p>
              <p className="mt-3 break-all font-mono text-sm">{user?.apiKey ?? 'Login untuk melihat API key'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Format URL</p>
              <p className="mt-3 break-all font-mono text-sm">https://api.nusapay.biz.id/{'{trxid}'}/{'{apikey}'}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <form action="/api/deposits" method="post" className="rounded-3xl border border-slate-200 p-5">
              <h2 className="text-xl font-bold">Ajukan Deposit</h2>
              <p className="mt-2 text-sm text-slate-500">Buat request deposit agar owner menerima notifikasi konfirmasi di Telegram.</p>
              <input className="input mt-4" type="number" name="amount" placeholder="Nominal deposit" min="1000" required />
              <input className="input mt-3" type="text" name="note" placeholder="Catatan (opsional)" />
              <button className="btn-primary mt-4 w-full">Kirim Request Deposit</button>
            </form>
            <form action="/api/withdrawals" method="post" className="rounded-3xl border border-slate-200 p-5">
              <h2 className="text-xl font-bold">Tarik Saldo</h2>
              <p className="mt-2 text-sm text-slate-500">Diproses manual maksimal 24 jam, saldo terpotong saat owner konfirmasi.</p>
              <input className="input mt-4" type="number" name="amount" placeholder="Jumlah withdraw" min="1000" required />
              <input className="input mt-3" type="text" name="payoutMethod" placeholder="Contoh: DANA / GoPay" required />
              <input className="input mt-3" type="text" name="payoutAccountName" placeholder="Nama akun tujuan" required />
              <input className="input mt-3" type="text" name="payoutAccountNo" placeholder="Nomor akun tujuan" required />
              <button className="btn-primary mt-4 w-full">Ajukan Withdraw</button>
            </form>
          </div>
        </section>
        <aside className="card">
          <h2 className="text-2xl font-bold">Notifikasi Terbaru</h2>
          <div className="mt-6 space-y-4">
            {notifications.length === 0 ? <p className="text-slate-500">Belum ada notifikasi.</p> : notifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
