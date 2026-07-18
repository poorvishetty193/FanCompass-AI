import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FanCompass AI',
  description: 'GenAI stadium companion for FIFA World Cup 2026',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] antialiased bg-black text-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
          Skip to content
        </a>
        <main id="main-content" className="flex flex-col min-h-[100dvh]">
          {children}
        </main>
      </body>
    </html>
  );
}
