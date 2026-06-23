'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site-config';

const slogans = siteConfig.hero.slogans;

export function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slogans.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden rounded-card border border-border bg-surface p-5 md:p-6"
      style={{
        backgroundImage: `url(${siteConfig.brand.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/80 to-bg/25" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_20%_20%,#22c55e55,transparent_40%),radial-gradient(circle_at_80%_10%,#15803d55,transparent_40%),radial-gradient(circle_at_50%_90%,#f59e0b33,transparent_45%)]" />
      <div className="relative max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{siteConfig.hero.tag}</p>
        <h1 className="mt-2 text-h1 font-semibold text-text">{siteConfig.hero.title}</h1>
        <p className="mt-2 text-base font-medium text-text md:text-lg" aria-live="polite" aria-atomic="true">
          {slogans[index]}
        </p>
        <p className="mt-3 max-w-2xl text-body text-text-muted">
          {siteConfig.hero.description}
        </p>
        <p className="mt-3 text-sm text-text-muted">{siteConfig.hero.statsLine}</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <a
            href="#calculator-form"
            className="inline-flex h-11 items-center rounded-input bg-accent px-4 text-sm font-semibold text-accent-contrast"
          >
            Calculate My Tax →
          </a>
          <a
            href="#consultant-cta"
            className="inline-flex h-11 items-center rounded-input border border-border px-4 text-sm font-semibold text-text"
          >
            Get Help Filing
          </a>
        </div>
      </div>
    </section>
  );
}
