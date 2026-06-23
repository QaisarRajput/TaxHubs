import { siteConfig } from '@/lib/site-config';

export function ConsultantCTA() {
  const cards = siteConfig.consultantCta.cards;

  return (
    <section id="consultant-cta" className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-text">Need Professional Help?</h2>

      <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        <article className="min-w-[260px] snap-start rounded-input border border-border bg-surface-muted p-4 transition hover:-translate-y-1 hover:shadow-sm">
          <p className="text-sm font-semibold text-text">{cards[0].title}</p>
          <p className="mt-2 text-sm text-text-muted">{cards[0].description}</p>
          <a href={cards[0].href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-input bg-accent px-3 py-2 text-sm font-medium text-accent-contrast">
            {cards[0].label}
          </a>
        </article>

        <article className="min-w-[260px] snap-start rounded-input border border-border bg-surface-muted p-4 transition hover:-translate-y-1 hover:shadow-sm">
          <p className="text-sm font-semibold text-text">{cards[1].title}</p>
          <p className="mt-2 text-sm text-text-muted">{cards[1].description}</p>
          <a href={cards[1].href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-input border border-border px-3 py-2 text-sm font-medium text-text">
            {cards[1].label}
          </a>
        </article>

        <article className="min-w-[260px] snap-start rounded-input border border-border bg-surface-muted p-4 transition hover:-translate-y-1 hover:shadow-sm">
          <p className="text-sm font-semibold text-text">{cards[2].title}</p>
          <p className="mt-2 text-sm text-text-muted">{cards[2].description}</p>
          <a href={cards[2].href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-input bg-accent px-3 py-2 text-sm font-medium text-accent-contrast">
            {cards[2].label}
          </a>
        </article>
      </div>

      <article className="mt-4 rounded-input border border-border bg-surface-muted p-3 text-sm text-text-muted">
        Disclaimer: This calculator provides estimates only. Consult a qualified tax professional for advice specific to your situation.
      </article>
    </section>
  );
}
