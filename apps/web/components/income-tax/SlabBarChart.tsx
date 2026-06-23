import type { TaxCalculationResult } from '@/lib/tax-engine';

type SlabBarChartProps = {
  result: TaxCalculationResult;
  currency: string;
  locale: string;
};

const colors = ['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'];

function formatMoney(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function SlabBarChart({ result, currency, locale }: SlabBarChartProps) {
  const totalTax = result.annual.totalTax;

  return (
    <section
      className="rounded-card border border-border bg-surface p-4"
      role="img"
      aria-label={`Your tax is spread across ${result.slabBreakdown.length} slabs`}
    >
      <h2 className="mb-3 text-lg font-semibold text-text">Slab Contribution Chart</h2>

      <div className="flex h-8 w-full overflow-hidden rounded-full border border-border bg-surface-muted">
        {result.slabBreakdown.map((row, index) => {
          const width = totalTax > 0 ? (row.taxInSlab / totalTax) * 100 : 0;
          return (
            <div
              key={row.slabLabel}
              title={`${row.slabLabel} · ${formatMoney(row.taxInSlab, currency, locale)} · ${width.toFixed(1)}%`}
              className="h-full transition-all duration-500"
              style={{ width: `${width.toFixed(2)}%`, backgroundColor: colors[index % colors.length] }}
            />
          );
        })}
      </div>

      <div className="mt-3 grid gap-2 text-xs text-text-muted md:grid-cols-2">
        {result.slabBreakdown.map((row, index) => (
          <div key={row.slabLabel} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>
              {row.slabLabel} - {formatMoney(row.taxInSlab, currency, locale)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
