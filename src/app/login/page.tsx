export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="card">
        <h1 className="text-3xl font-bold">Masuk ke NusaPay</h1>
        <form action="/api/auth/login" method="post" className="mt-8 space-y-4">
          <input className="input" type="text" name="username" placeholder="Username" required />
          <input className="input" type="password" name="password" placeholder="Password" required />
          <button className="btn-primary w-full">Login</button>
        </form>
        <form action="/api/auth/forgot-password" method="post" className="mt-4 space-y-3">
          <input className="input" type="email" name="email" placeholder="Email untuk reset password" required />
          <button className="btn-secondary w-full">Kirim Password Sementara</button>
        </form>
        <p className="mt-6 text-sm text-slate-500">Google login disiapkan melalui env Google OAuth dan halaman setup profil pertama.</p>
      </div>
    </main>
  );
}
