import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Copyright Policy',
  description: 'Strict copyright, anti-scraping, and code/content usage restrictions.',
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org/copyright',
  },
  openGraph: {
    title: 'Copyright Policy | tax.hubs.dpdns.org',
    description: 'Strict copyright, anti-scraping, and code/content usage restrictions.',
    url: 'https://tax.hubs.dpdns.org/copyright',
    type: 'website',
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
    title: 'Copyright Policy | tax.hubs.dpdns.org',
    description: 'Strict copyright, anti-scraping, and code/content usage restrictions.',
    images: [siteConfig.brand.banner],
  },
};

export default function CopyrightPage() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-4 py-8">
      <article className="rounded-card border border-border bg-surface p-6">
        <h1 className="text-h1 font-semibold text-text">Copyright Policy</h1>
        <p className="mt-3 text-body text-text-muted">
          Copyright (c) 2026 tax.hubs.dpdns.org. All rights reserved. The website, source code,
          datasets, and written content are proprietary.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-text">Strict prohibitions</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-sm text-text-muted">
          <li>No scraping, crawling, bulk extraction, or automated copying.</li>
          <li>No reuse or publication of repository code without written permission.</li>
          <li>No AI/ML training, fine-tuning, or dataset generation from this content.</li>
          <li>No mirroring, relicensing, or redistribution of code/content/assets.</li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold text-text">Enforcement</h2>
        <p className="mt-2 text-sm text-text-muted">
          Unauthorized use may result in access restrictions, takedown requests, and legal action.
        </p>
      </article>
    </section>
  );
}
