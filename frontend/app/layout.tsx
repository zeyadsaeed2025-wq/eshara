import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مترجم لغة الإشارة | Sign Language Translator',
  description: 'Real-time Arabic Sign Language Translation using AI',
  keywords: ['sign language', 'Arabic', 'translation', 'AI', 'accessibility', 'deaf', 'hearing impaired'],
  authors: [{ name: 'Sign Language Translator Team' }],
  openGraph: {
    title: 'Real-Time Sign Language Translator',
    description: 'AI-powered Arabic Sign Language Translation',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
