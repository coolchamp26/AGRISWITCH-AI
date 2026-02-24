import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'AgriSwitch AI — Crop Residue Decision Intelligence',
  description:
    'AI-powered platform helping Indian farmers make economically rational decisions about crop residue management. Compare burning vs sustainable alternatives with real economic analysis.',
  keywords: ['crop residue', 'stubble burning', 'India agriculture', 'sustainable farming', 'CRM subsidy'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
