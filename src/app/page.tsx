import Link from 'next/link';
import { Shield, Wallet, QrCode, Bot, BookOpen } from 'lucide-react';
import { SectionTitle } from '@/components/section-title';

const features = [
  { icon: QrCode, title: 'QRIS ke owner', text: 'Semua pembayaran diarahkan ke QRIS owner, lalu saldo pengguna dikelola aman di wallet NusaPay.' },
  { icon: Wallet, title: 'Wallet realtime', text: 'Deposit dan transaksi API otomatis menambah saldo pengguna secara realtime.' },
  { icon: Bot, title: 'Bot Telegram owner', text: 'Konfirmasi deposit, withdraw, maintenance, dan broadcast notifikasi langsung dari Telegram.' },
  { icon: Shield, title: 'OTP & proteksi akun', text: 'Verifikasi email OTP, reset password via email, dan API key unik untuk setiap pengguna.' }
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
            Payment gateway personal yang bersih, cepat, dan mudah dikelola
          </div>
          <div className="space-y-5">
            <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-7xl">NusaPay untuk deposit, wallet, dan withdraw manual yang rapi.</h1>
            <p className="max-w-xl text-lg text-slate-600">
              Website full-stack bergaya premium dengan halaman Home, Pengaturan, Dashboard, dan Dokumentasi integrasi API untuk model gateway berbasis QRIS owner.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="btn-primary">Mulai Sekarang</Link>
            <Link href="/docs" className="btn-secondary">Lihat Dokumentasi</Link>
          </div>
        </div>
        <div className="card grid gap-5">
          <div>
            <p className="text-sm text-slate-500">Alur utama</p>
            <h3 className="mt-2 text-2xl font-bold">QRIS → Konfirmasi → Wallet → API</h3>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">Base URL API</p>
            <p className="mt-2 break-all font-mono text-lg">https://api.nusapay.biz.id</p>
          </div>
          <div className="grid gap-3 rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center justify-between"><span>Deposit manual</span><span className="font-semibold">Telegram confirm</span></div>
            <div className="flex items-center justify-between"><span>Withdraw</span><span className="font-semibold">≤ 24 jam</span></div>
            <div className="flex items-center justify-between"><span>Integrasi API</span><span className="font-semibold">Otomatis</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionTitle eyebrow="Fitur Utama" title="Semua yang dibutuhkan untuk gateway pembayaran personal." description="Disusun untuk operasional owner yang simpel, dengan UI putih bersih dan fondasi backend yang mudah dikembangkan." />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card space-y-4">
              <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600"><Icon size={24} /></div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="card flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Dokumentasi API</p>
            <h3 className="mt-2 text-3xl font-bold">Quick start, webhook, endpoint, dan status transaksi.</h3>
          </div>
          <Link href="/docs" className="btn-primary"><BookOpen className="mr-2" size={18} />Buka Panduan</Link>
        </div>
      </section>
    </main>
  );
}
