# NusaPay Starter

Starter full-stack Next.js untuk payment gateway personal bergaya putih bersih.

## Yang sudah tersedia
- Landing page, dashboard, settings, dokumentasi API, maintenance page
- Register + OTP email
- Login username/password
- Forgot password dengan password sementara via email
- Wallet user, request deposit, request withdraw
- Konfirmasi deposit & withdraw via bot Telegram owner
- Command bot: /sendnotify, /maintenance, /listpengguna, /addsaldo
- Endpoint payment API otomatis: `POST /api/v1/payment`
- Prisma schema untuk user, ledger, deposit, withdrawal, notification, system config

## Catatan penting
- Token bot Telegram sebaiknya **di-rotate** karena sudah pernah dibagikan.
- File logo dan QRIS asli belum dapat saya sematkan otomatis dari chat image, jadi ganti:
  - `public/logo.svg` dengan logo final Anda
  - `public/qris-placeholder.txt` dengan file QRIS asli, misalnya `public/qris.png`
- Google login saya siapkan sebagai slot env/configurasi, tetapi alur OAuth final masih perlu disambungkan dengan provider pilihan Anda.
- Middleware maintenance di starter ini masih sederhana. Untuk produksi, lebih baik baca flag dari database/cache terpusat.

## Menjalankan lokal
```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Jalankan bot Telegram di proses terpisah:
```bash
npm run bot
```

## Endpoint inti
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/settings/password`
- `POST /api/deposits`
- `POST /api/withdrawals`
- `POST /api/v1/payment`

## Deploy
- Frontend + backend: VPS / Vercel / server Node.js
- Database: ubah `DATABASE_URL` ke PostgreSQL/MySQL untuk produksi
- Worker bot Telegram: proses Node terpisah via PM2/systemd
