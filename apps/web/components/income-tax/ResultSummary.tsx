import type { TaxCalculationResult } from '@/lib/tax-engine';

type ResultSummaryProps = {
  result: TaxCalculationResult;
  view: 'monthly' | 'yearly';
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

export function ResultSummary({ result, view, currency, locale }: ResultSummaryProps) {
  const figures = view === 'monthly' ? result.monthly : result.annual;

  const items = [
    { label: 'Gross Income', value: formatMoney(figures.grossIncome, currency, locale) },
    { label: 'Taxable Income', value: formatMoney(figures.taxableIncome, currency, locale) },
    { label: 'Income Tax', value: formatMoney(figures.incomeTax, currency, locale) },
    { label: 'Total Tax', value: formatMoney(figures.totalTax, currency, locale) },
    { label: 'Take-Home Pay', value: formatMoney(figures.takeHome, currency, locale) },
    { label: 'Effective Tax Rate', value: `${(result.effectiveRate * 100).toFixed(2)}%` },
  ];

  return (
    <section
      className="grid grid-cols-2 gap-3 md:grid-cols-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {items.map((item) => (
        <article key={item.label} className="min-w-0 rounded-card border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">{item.label}</p>
          <p className="mt-2 text-base font-semibold leading-tight text-text [font-variant-numeric:tabular-nums] md:text-lg">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
