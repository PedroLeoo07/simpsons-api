import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Simpsons API',
  description: 'Explore personagens, episódios e locações dos Simpsons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
