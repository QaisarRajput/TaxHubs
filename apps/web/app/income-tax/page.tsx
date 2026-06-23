import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/site-config';

const IncomeTaxCalculator = dynamic(
  () => import('@/components/income-tax/IncomeTaxCalculator').then((mod) => mod.IncomeTaxCalculator),
  {
    loading: () => (
      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-8">
        <div className="h-48 animate-pulse rounded-card border border-border bg-surface-muted" />
        <div className="h-64 animate-pulse rounded-card border border-border bg-surface-muted" />
      </section>
    ),
  },
);

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Income Tax Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://tax.hubs.dpdns.org/income-tax',
  description: siteConfig.seo.incomeTaxDescription,
};

export const metadata: Metadata = {
  title: siteConfig.seo.incomeTaxTitle,
  description: siteConfig.seo.incomeTaxDescription,
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org/income-tax',
  },
  openGraph: {
    type: 'website',
    title: siteConfig.seo.incomeTaxTitle,
    description: siteConfig.seo.incomeTaxDescription,
    url: 'https://tax.hubs.dpdns.org/income-tax',
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
    title: siteConfig.seo.incomeTaxTitle,
    description: siteConfig.seo.incomeTaxDescription,
    images: [siteConfig.brand.banner],
  },
};

export default function IncomeTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <IncomeTaxCalculator />
    </>
  );
}
