'use client';

import Link from 'next/link';
import { useCountry } from '@/hooks/useCountry';
import { getBlogsByCountry } from '@/lib/blog-articles';

export function BlogsByCountry() {
  const [country] = useCountry();
  const cards = getBlogsByCountry(country);

  return (
    <>
      <p className="mt-3 max-w-3xl text-body text-text-muted">
        Showing curated topics for {country === 'PK' ? 'Pakistan' : 'India'}. Switch country from the header to see
        country-specific blog ideas.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.title} className="rounded-input border border-border bg-surface-muted p-4">
            <h2 className="text-lg font-semibold text-text">{card.title}</h2>
            <p className="mt-2 text-sm text-text-muted">{card.description}</p>
            <Link
              href={`/blogs/${card.slug}`}
              className="mt-3 inline-flex text-sm font-semibold text-accent hover:text-accent-hover"
            >
              Read article {'->'}
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
