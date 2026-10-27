import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'URUBU HUNTER',
  description: 'URUBU HUNTER — Garimpo de rua, marcas de nicho e achados.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='20' fill='%23050505'/><path d='M25 35L50 65L75 35H60L50 48L40 35H25Z' fill='%23FFFFFF'/><circle cx='50' cy='75' r='5' fill='%23E5E5E5'/></svg>"
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
