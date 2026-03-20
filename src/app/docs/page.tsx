const sections = [
  {
    title: 'Quick Start',
    body: 'Daftar akun, verifikasi OTP email, login, lalu salin API key dari dashboard untuk mulai memakai endpoint NusaPay.'
  },
  {
    title: 'Autentikasi',
    body: 'Setiap request API memakai API key unik milik pengguna. Format URL dasar: https://api.nusapay.biz.id/{trxid}/{apikey}.'
  },
  {
    title: 'Endpoints',
    body: 'Gunakan endpoint create payment, cek status transaksi, deposit, withdraw, dan wallet untuk mengelola saldo secara realtime.'
  },
  {
    title: 'Webhook',
    body: 'Sistem Anda dapat menerima callback status pembayaran agar transaksi otomatis ditandai berhasil di sisi merchant.'
  },
  {
    title: 'Request Withdraw & Status',
    body: 'Merchant dapat mengirim request withdraw via API atau dashboard. Status dapat dicek sampai owner memproses pencairan.'
  },
  {
    title: 'Wallet & Transaksi Realtime',
    body: 'Deposit terkonfirmasi dan payment API otomatis akan masuk ke saldo pengguna tanpa perlu refresh manual yang rumit.'
  },
  {
    title: 'OTP & Verifikasi Email',
    body: 'Akun baru wajib OTP email. Reset password mengirim password sementara ke email sistem pengguna.'
  }
];

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <div className="card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Dokumentasi / Panduan Integrasi API</p>
        <h1 className="mt-3 text-4xl font-bold">Panduan Integrasi NusaPay</h1>
        <p className="mt-4 text-slate-600">Base URL API: <span className="font-mono">https://api.nusapay.biz.id</span></p>

        <div className="mt-8 rounded-3xl bg-slate-950 p-5 text-sm text-white">
          <p className="font-semibold">Contoh format integrasi</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono">https://api.nusapay.biz.id/{'{trxid}'}/{'{apikey}'}</pre>
        </div>

        <div className="mt-8 space-y-6">
          {sections.map((item) => (
            <section key={item.title} className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 text-slate-600">{item.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 p-6">
          <h2 className="text-2xl font-bold">Contoh request payment</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-50 p-4 text-sm">
{`POST /api/v1/payment
{
  "trxId": "INV-001",
  "apikey": "user_api_key",
  "amount": 50000,
  "customerName": "Budi",
  "callbackUrl": "https://merchant.id/webhook"
}`}</pre>
        </div>
      </div>
    </main>
  );
}
