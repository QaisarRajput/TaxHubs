import type { TaxCalculationResult } from '@/lib/tax-engine';

type YearComparisonProps = {
  currentYear: string;
  previousYear: string;
  currentResult: TaxCalculationResult;
  previousResult: TaxCalculationResult;
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

export function YearComparison({
  currentYear,
  previousYear,
  currentResult,
  previousResult,
  currency,
  locale,
}: YearComparisonProps) {
  const annualDelta = currentResult.annual.totalTax - previousResult.annual.totalTax;
  const monthlyDelta = currentResult.monthly.totalTax - previousResult.monthly.totalTax;
  const improved = annualDelta < 0;

  return (
    <section className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-lg font-semibold text-text">vs. Previous Year</h2>
      <p className="mt-2 text-sm text-text-muted">
        {currentYear} compared to {previousYear}
      </p>
      <p className={['mt-2 text-sm font-semibold', improved ? 'text-accent' : 'text-danger'].join(' ')}>
        Annual delta: {formatMoney(annualDelta, currency, locale)} · Monthly delta:{' '}
        {formatMoney(monthlyDelta, currency, locale)}
      </p>
      <p className="text-sm text-text-muted">
        Effective rate change: {((currentResult.effectiveRate - previousResult.effectiveRate) * 100).toFixed(2)}%
      </p>
    </section>
  );
}
