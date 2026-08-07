import type { Metadata, Viewport } from 'next';
import { Yatra_One } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
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
      <head>
        {/* Google Tag Manager - Head Script */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NVQCNDSJ');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) - Body fallback */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-NVQCNDSJ"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'} />
      </body>
    </html>
  );
}
