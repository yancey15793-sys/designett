import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prisme',
  description: 'Transformer le flux de l’information en compréhension finie.',
};

export default function RacineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
