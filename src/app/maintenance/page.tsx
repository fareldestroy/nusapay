import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="card max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">503</p>
        <h1 className="mt-3 text-4xl font-bold">Server Sedang Dalam Pemeliharaan</h1>
        <p className="mt-4 text-slate-600">Kami sedang melakukan peningkatan sistem. Mohon tunggu beberapa saat.</p>
        <Link href="/login" className="btn-primary mt-8">Keluar</Link>
      </div>
    </main>
  );
}
