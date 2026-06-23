import type { TaxCalculationResult } from '@/lib/tax-engine';

type SlabBreakdownProps = {
  result: TaxCalculationResult;
  view: 'monthly' | 'yearly';
  mode: 'progressive' | 'active';
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

export function SlabBreakdown({ result, view, mode, currency, locale }: SlabBreakdownProps) {
  const scale = view === 'monthly' ? 12 : 1;
  const totalTax = result.annual.totalTax;
  const contributingRows = result.slabBreakdown.filter((row) => row.taxableAmountInSlab > 0);
  const activeRow = contributingRows[contributingRows.length - 1];
  const rowsToRender =
    mode === 'active'
      ? activeRow
        ? [activeRow]
        : result.slabBreakdown.slice(0, 1)
      : contributingRows.length > 0
        ? contributingRows
        : result.slabBreakdown.slice(0, 1);

  return (
    <section className="overflow-hidden rounded-card border border-border bg-surface p-4">
      <h2 className="mb-3 text-lg font-semibold text-text">Tax Breakdown by Slab</h2>
      <p className="mb-3 text-sm text-text-muted">
        {mode === 'progressive'
          ? 'Progressive view: income is split across slabs and each slice is taxed at its own rate.'
          : 'Active bracket view: shows only your current slab for a quick bracket-level read.'}
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] text-left text-sm md:min-w-full">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="sticky left-0 z-10 bg-surface px-3 py-2">Slab Range</th>
              <th className="px-3 py-2">Taxable Amount ({view})</th>
              <th className="px-3 py-2">Rate</th>
              <th className="px-3 py-2">Tax ({view})</th>
              <th className="px-3 py-2">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {rowsToRender.map((row) => {
              const percent = mode === 'active' ? 100 : totalTax > 0 ? (row.taxInSlab / totalTax) * 100 : 0;
              return (
                <tr
                  key={row.slabLabel}
                  className="border-b border-border transition hover:bg-accent-soft/40"
                >
                  <td className="sticky left-0 z-[1] bg-surface px-3 py-2 font-medium text-text">
                    {row.slabLabel}
                  </td>
                  <td className="px-3 py-2 text-text">
                    {formatMoney(row.taxableAmountInSlab / scale, currency, locale)}
                  </td>
                  <td className="px-3 py-2 text-text">{(row.rate * 100).toFixed(2)}%</td>
                  <td className="px-3 py-2 text-text">
                    {formatMoney(row.taxInSlab / scale, currency, locale)}
                  </td>
                  <td className="px-3 py-2 text-text">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className="h-full bg-accent transition-all duration-500"
                          style={{ width: `${percent.toFixed(2)}%` }}
                        />
                      </div>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-1 text-sm text-text">
        <p>Standard Deduction: {formatMoney((view === 'monthly' ? result.monthly : result.annual).standardDeduction, currency, locale)}</p>
        <p>Income Tax: {formatMoney((view === 'monthly' ? result.monthly : result.annual).incomeTax, currency, locale)}</p>
        {(view === 'monthly' ? result.monthly : result.annual).surcharge > 0 ? (
          <p>Surcharge: {formatMoney((view === 'monthly' ? result.monthly : result.annual).surcharge, currency, locale)}</p>
        ) : null}
        {(view === 'monthly' ? result.monthly : result.annual).cess > 0 ? (
          <p>Cess: {formatMoney((view === 'monthly' ? result.monthly : result.annual).cess, currency, locale)}</p>
        ) : null}
        <p className="font-semibold text-accent">
          Total Tax: {formatMoney((view === 'monthly' ? result.monthly : result.annual).totalTax, currency, locale)}
        </p>
        <p className="font-semibold text-accent">
          Take-Home Pay: {formatMoney((view === 'monthly' ? result.monthly : result.annual).takeHome, currency, locale)}
        </p>
      </div>
    </section>
  );
}
