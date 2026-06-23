import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy practices for the tax calculator and related content pages.',
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | tax.hubs.dpdns.org',
    description: 'Privacy practices for the tax calculator and related content pages.',
    url: 'https://tax.hubs.dpdns.org/privacy',
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
    title: 'Privacy Policy | tax.hubs.dpdns.org',
    description: 'Privacy practices for the tax calculator and related content pages.',
    images: [siteConfig.brand.banner],
  },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-4 py-8">
      <article className="rounded-card border border-border bg-surface p-6">
        <h1 className="text-h1 font-semibold text-text">Privacy Policy</h1>
        <p className="mt-3 text-body text-text-muted">
          We do not require account sign-up to use the calculator. Inputs are processed in-browser and
          are not submitted to a backend service by default.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Data usage</h2>
        <p className="mt-2 text-sm text-text-muted">
          Theme and selected preferences may be stored locally in your browser to improve your return
          visits. You can clear this anytime from browser settings.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Third-party links</h2>
        <p className="mt-2 text-sm text-text-muted">
          External links to official tax portals and social platforms are provided for convenience and
          follow their own privacy policies.
        </p>
        <h2 className="mt-6 text-lg font-semibold text-text">Automated collection</h2>
        <p className="mt-2 text-sm text-text-muted">
          Unauthorized automated scraping or bulk extraction is not permitted and may be blocked or
          actioned under applicable law and our Terms.
        </p>
      </article>
    </section>
  );
}
