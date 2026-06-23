import type { TaxCalculationResult } from '@/lib/tax-engine';

type RegimeComparisonProps = {
  oldResult: TaxCalculationResult;
  newResult: TaxCalculationResult;
  currency: string;
  locale: string;
};

function formatMoney(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function RegimeComparison({ oldResult, newResult, currency, locale }: RegimeComparisonProps) {
  const oldTax = oldResult.annual.totalTax;
  const newTax = newResult.annual.totalTax;
  const winner = oldTax <= newTax ? 'old' : 'new';
  const delta = Math.abs(oldTax - newTax);

  return (
    <section className="rounded-card border border-border bg-surface p-4">
      <h2 className="mb-3 text-lg font-semibold text-text">Which regime saves you more?</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-input border border-border bg-surface-muted p-4">
          <p className="text-sm font-semibold text-text">Old Regime</p>
          <p className="mt-1 text-sm text-text-muted">Annual Tax: {formatMoney(oldTax, currency, locale)}</p>
          <p className="text-sm text-text-muted">Effective Rate: {(oldResult.effectiveRate * 100).toFixed(2)}%</p>
          <p className="text-sm text-text-muted">Take-home / month: {formatMoney(oldResult.monthly.takeHome, currency, locale)}</p>
        </article>
        <article className="rounded-input border border-border bg-surface-muted p-4">
          <p className="text-sm font-semibold text-text">New Regime</p>
          <p className="mt-1 text-sm text-text-muted">Annual Tax: {formatMoney(newTax, currency, locale)}</p>
          <p className="text-sm text-text-muted">Effective Rate: {(newResult.effectiveRate * 100).toFixed(2)}%</p>
          <p className="text-sm text-text-muted">Take-home / month: {formatMoney(newResult.monthly.takeHome, currency, locale)}</p>
        </article>
      </div>
      <p className={['mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold', winner === 'old' ? 'bg-accent-soft text-accent' : 'bg-warn/20 text-warn'].join(' ')}>
        {winner === 'old' ? `Old regime saves ${formatMoney(delta, currency, locale)} per year` : `New regime saves ${formatMoney(delta, currency, locale)} per year`}
      </p>
    </section>
  );
}
