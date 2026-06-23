import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { AppBar } from '@/components/app-shell/AppBar';
import { Footer } from '@/components/app-shell/Footer';
import { CountryProvider } from '@/hooks/useCountry';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem('tax.theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored ? stored === 'dark' : prefersDark;
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    }
  } catch (_err) {
    // no-op
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL('https://tax.hubs.dpdns.org'),
  title: {
    default: siteConfig.seo.siteTitle,
    template: '%s | tax.hubs.dpdns.org',
  },
  description: siteConfig.seo.siteDescription,
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org',
  },
  openGraph: {
    type: 'website',
    url: 'https://tax.hubs.dpdns.org',
    title: siteConfig.seo.siteTitle,
    description: siteConfig.seo.siteDescription,
    images: [
      {
        url: siteConfig.brand.banner,
        width: 1200,
        height: 630,
        alt: siteConfig.seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.siteTitle,
    description: siteConfig.seo.siteDescription,
    images: [siteConfig.brand.banner],
  },
  icons: {
    icon: siteConfig.brand.favicon,
    shortcut: siteConfig.brand.favicon,
    apple: siteConfig.brand.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-full bg-bg text-text">
        <CountryProvider>
          <AppBar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </CountryProvider>
      </body>
    </html>
  );
}
