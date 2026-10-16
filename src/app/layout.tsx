import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'KeeyShop | Tienda Oficial de Tecnología',
    template: '%s | KeeyShop',
  },
  description: 'E-commerce corporativo de hardware y tecnología de vanguardia. Garantía oficial, catálogo en tiempo real y pagos seguros.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'KeeyShop | E-commerce Tecnológico',
    description: 'Catálogo de hardware, electrónica y tecnología profesional con Next.js 16 y Laravel 12.',
    siteName: 'KeeyShop',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
