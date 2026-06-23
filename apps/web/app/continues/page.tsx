import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Continues',
  description: 'Ongoing updates and continuity notes for tax data and platform coverage.',
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org/continues',
  },
  openGraph: {
    title: 'Continues | tax.hubs.dpdns.org',
    description: 'Ongoing updates and continuity notes for tax data and platform coverage.',
    url: 'https://tax.hubs.dpdns.org/continues',
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
    title: 'Continues | tax.hubs.dpdns.org',
    description: 'Ongoing updates and continuity notes for tax data and platform coverage.',
    images: [siteConfig.brand.banner],
  },
};

export default function ContinuesPage() {
  return (
    <section className="mx-auto w-full max-w-[960px] px-4 py-8">
      <article className="rounded-card border border-border bg-surface p-6">
        <h1 className="text-h1 font-semibold text-text">Continues</h1>
        <p className="mt-3 text-body text-text-muted">
          This page tracks continuous updates to tax slabs, calculator improvements, and upcoming country
          expansion milestones.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-text-muted">
          <li>Annual slab refresh and validation workflow updates.</li>
          <li>New educational guides and filing walkthroughs in Blogs.</li>
          <li>Planned country additions with configurable data packs.</li>
        </ul>
      </article>
    </section>
  );
}
