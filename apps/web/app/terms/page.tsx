import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of the tax calculator and educational content.',
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org/terms',
  },
  openGraph: {
    title: 'Terms of Use | tax.hubs.dpdns.org',
    description: 'Terms governing use of the tax calculator and educational content.',
    url: 'https://tax.hubs.dpdns.org/terms',
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
    title: 'Terms of Use | tax.hubs.dpdns.org',
    description: 'Terms governing use of the tax calculator and educational content.',
    images: [siteConfig.brand.banner],
  },
};

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-4 py-8">
      <article className="rounded-card border border-border bg-surface p-6">
        <h1 className="text-h1 font-semibold text-text">Terms of Use</h1>
        <p className="mt-3 text-body text-text-muted">
          This calculator provides estimates based on configured slab data. It is for educational and
          planning purposes and should not be treated as legal, financial, or tax advice.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Accuracy and liability</h2>
        <p className="mt-2 text-sm text-text-muted">
          We make reasonable efforts to keep data current, but users are responsible for verifying final
          obligations against official tax authority guidance.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Content usage</h2>
        <p className="mt-2 text-sm text-text-muted">
          You may reference or share links to this website. Republishing, mirroring, or redistributing
          code, content, datasets, or media without prior written permission is prohibited.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Automated access restrictions</h2>
        <p className="mt-2 text-sm text-text-muted">
          Scraping, crawling, mining, harvesting, or bulk extraction by automated tools (including bots,
          scripts, and API emulators) is strictly prohibited.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">AI/ML usage restrictions</h2>
        <p className="mt-2 text-sm text-text-muted">
          You must not use repository or website content for AI/ML training, fine-tuning, embedding,
          retrieval datasets, synthetic data generation, or model evaluation without explicit written
          authorization.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Intellectual property</h2>
        <p className="mt-2 text-sm text-text-muted">
          All source code and content are proprietary and protected by copyright law. All rights are
          reserved unless a separate signed license states otherwise.
        </p>
      </article>
    </section>
  );
}
