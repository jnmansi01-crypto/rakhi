import type { Metadata, Viewport } from 'next';
import { Yatra_One } from 'next/font/google';
import './globals.css';

const yatraOne = Yatra_One({ 
  weight: '400', 
  subsets: ['devanagari', 'latin'],
  variable: '--font-yatra',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Rakhi – Digital Raksha Bandhan Gift',
  description: 'Send a heartfelt digital Raksha Bandhan gift to your sibling. An immersive, emotional experience delivered to their phone.',
  keywords: ['rakhi', 'raksha bandhan', 'digital gift', 'sibling', 'festival'],
  openGraph: {
    title: 'Rakhi – A Digital Gift for Your Sibling',
    description: 'An immersive digital Raksha Bandhan experience.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${yatraOne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
