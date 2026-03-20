export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="card">
        <h1 className="text-3xl font-bold">Buat Akun NusaPay</h1>
        <form action="/api/auth/register" method="post" className="mt-8 space-y-4">
          <input className="input" type="text" name="username" placeholder="Username" required />
          <input className="input" type="email" name="email" placeholder="Email" required />
          <input className="input" type="password" name="password" placeholder="Password" required />
          <button className="btn-primary w-full">Daftar & Kirim OTP</button>
        </form>
        <form action="/api/auth/verify-otp" method="post" className="mt-6 space-y-4 border-t border-slate-200 pt-6">
          <input className="input" type="email" name="email" placeholder="Email terdaftar" required />
          <input className="input" type="text" name="otp" placeholder="Kode OTP 6 digit" required />
          <button className="btn-secondary w-full">Verifikasi OTP</button>
        </form>
      </div>
    </main>
  );
}
