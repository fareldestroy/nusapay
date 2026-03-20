import './globals.css';
import { Navbar } from '@/components/navbar';

export const metadata = {
  title: 'NusaPay',
  description: 'Gateway pembayaran QRIS dan wallet realtime.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
