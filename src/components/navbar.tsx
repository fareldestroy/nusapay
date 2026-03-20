import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/settings', label: 'Pengaturan' },
  { href: '/docs', label: 'Dokumentasi' }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-brand-500">Nusa</span>Pay
        </Link>
        <nav className="hidden gap-6 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary text-sm">Masuk</Link>
          <Link href="/register" className="btn-primary text-sm">Buat Akun</Link>
        </div>
      </div>
    </header>
  );
}
