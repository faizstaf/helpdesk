import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AduanFasiliti — Sistem Aduan Kerosakan Fasiliti',
  description:
    'Sistem Aduan Kerosakan Fasiliti pintar untuk pelajar dan staf melaporkan kerosakan bangunan serta memantau status tindakan.',
  openGraph: {
    title: 'AduanFasiliti — Sistem Aduan Kerosakan Fasiliti',
    description:
      'Sistem Aduan Kerosakan Fasiliti pintar untuk pelajar dan staf melaporkan kerosakan bangunan serta memantau status tindakan.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AduanFasiliti — Sistem Aduan Kerosakan Fasiliti',
    description:
      'Sistem Aduan Kerosakan Fasiliti pintar untuk pelajar dan staf melaporkan kerosakan bangunan serta memantau status tindakan.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body
        className="min-h-screen bg-slate-50 text-slate-900 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
