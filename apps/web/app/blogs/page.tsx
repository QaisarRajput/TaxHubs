import type { Metadata } from 'next';
import { BlogsByCountry } from '@/components/blogs/BlogsByCountry';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Blogs & Guides',
  description: 'Tax blogs, filing guides, and practical how-to content for individuals and businesses.',
  alternates: {
    canonical: 'https://tax.hubs.dpdns.org/blogs',
  },
  openGraph: {
    title: 'Blogs & Guides | tax.hubs.dpdns.org',
    description: 'Tax blogs, filing guides, and practical how-to content for individuals and businesses.',
    url: 'https://tax.hubs.dpdns.org/blogs',
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
    title: 'Blogs & Guides | tax.hubs.dpdns.org',
    description: 'Tax blogs, filing guides, and practical how-to content for individuals and businesses.',
    images: [siteConfig.brand.banner],
  },
};

export default function BlogsPage() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <div className="rounded-card border border-border bg-surface p-6">
        <h1 className="text-h1 font-semibold text-text">Blogs & Guides</h1>
        <BlogsByCountry />
      </div>
    </section>
  );
}
