export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="card">
        <p className="text-sm text-slate-500">Pengaturan Profil</p>
        <h1 className="mt-2 text-4xl font-bold">Ganti Password</h1>
        <form action="/api/settings/password" method="post" className="mt-8 space-y-4">
          <input className="input" type="password" name="oldPassword" placeholder="Password lama" required />
          <input className="input" type="password" name="newPassword" placeholder="Password baru" required />
          <input className="input" type="password" name="confirmPassword" placeholder="Konfirmasi password baru" required />
          <button className="btn-primary w-full">Simpan Password Baru</button>
        </form>
      </div>
    </main>
  );
}
