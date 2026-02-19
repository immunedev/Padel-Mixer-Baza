import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Baza Padel Tournament',
  description: 'Aplikacja do organizacji turniejów padel. Americano, Mexicano i więcej formatów turniejowych.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <div className="court-bg" />
        <AppProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
