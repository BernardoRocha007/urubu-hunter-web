import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'URUBU HUNTER',
  description: 'URUBU HUNTER — Garimpo de rua, marcas de nicho e achados.',
  icons: {
    icon: [
      { url: '/urubu-icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/urubu-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    shortcut: '/urubu-icon.png',
    apple: '/urubu-icon-192.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
