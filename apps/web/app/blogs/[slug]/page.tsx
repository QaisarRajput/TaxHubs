import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { blogArticles, getBlogBySlug } from '@/lib/blog-articles';
import { siteConfig } from '@/lib/site-config';

type Params = {
  slug: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogBySlug(slug);

  if (!article) {
    return {
      title: 'Blog Not Found',
      description: 'The requested article could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const url = `https://tax.hubs.dpdns.org/blogs/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
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
      title: article.title,
      description: article.description,
      images: [siteConfig.brand.banner],
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getBlogBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-[960px] px-4 py-8">
      <article className="rounded-card border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {article.country === 'PK' ? 'Pakistan' : 'India'}
        </p>
        <h1 className="mt-2 text-h1 font-semibold text-text">{article.title}</h1>
        <p className="mt-3 text-body text-text-muted">{article.description}</p>

        <div className="mt-6 space-y-4 text-base leading-7 text-text">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </section>
  );
}
