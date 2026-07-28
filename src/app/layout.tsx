import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Felipe Muniz — Guia do Caminho da Fé',
    template: '%s · Felipe Muniz',
  },
  description:
    'Saídas guiadas no Caminho da Fé, entre Águas da Prata e Aparecida, com o guia Felipe Muniz.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
