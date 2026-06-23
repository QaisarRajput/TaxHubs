import { useMemo, useState } from 'react';

type TrendPoint = {
  year: string;
  monthlyTax: number;
};

type PreviousYearsTaxSparklineProps = {
  points: TrendPoint[];
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

function formatPointValue(value: number): string {
  const absValue = Math.abs(value);
  const formatShort = (input: number) => {
    return input.toFixed(input >= 10 ? 0 : 1).replace(/\.0$/, '');
  };

  if (absValue >= 1_000_000) {
    return `${formatShort(value / 1_000_000)}M Rs`;
  }

  if (absValue >= 1_000) {
    return `${formatShort(value / 1_000)}K Rs`;
  }

  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)} Rs`;
}

export function PreviousYearsTaxSparkline({
  points,
  currency,
  locale,
}: PreviousYearsTaxSparklineProps) {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  if (points.length === 0) {
    return null;
  }

  const chartWidth = 860;
  const chartHeight = 280;
  const margin = { top: 16, right: 16, bottom: 68, left: 72 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const minValue = Math.min(...points.map((point) => point.monthlyTax));
  const maxValue = Math.max(...points.map((point) => point.monthlyTax));
  const paddedMin = Math.max(0, minValue * 0.9);
  const paddedMax = maxValue * 1.1;
  const valueRange = Math.max(1, paddedMax - paddedMin);
  const xStep = points.length > 1 ? innerWidth / (points.length - 1) : 0;

  const coordinates = points.map((point, index) => {
    const x = margin.left + index * xStep;
    const normalizedY = (point.monthlyTax - paddedMin) / valueRange;
    const y = margin.top + innerHeight - normalizedY * innerHeight;
    return { ...point, x, y };
  });

  const linePath = coordinates.map((point) => `${point.x},${point.y}`).join(' ');
  const yTicks = useMemo(() => {
    return Array.from({ length: 4 }, (_, index) => {
      const ratio = index / 3;
      const value = paddedMax - ratio * (paddedMax - paddedMin);
      const y = margin.top + ratio * innerHeight;
      return { value, y };
    });
  }, [innerHeight, margin.top, paddedMax, paddedMin]);

  const hoveredPoint =
    (hoveredYear ? coordinates.find((point) => point.year === hoveredYear) : null) ?? null;
  return (
    <section className="rounded-card border border-border bg-surface p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-text-muted">Previous Years Monthly Tax</p>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>Low: {formatMoney(minValue, currency, locale)}</span>
          <span>High: {formatMoney(maxValue, currency, locale)}</span>
        </div>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-input border border-border bg-surface-muted p-2 sm:p-3">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-52 w-full sm:h-56 md:h-64 lg:h-72"
          role="img"
          aria-label="Monthly tax trend across previous fiscal years"
        >
          {yTicks.map((tick, index) => (
            <g key={`tick-${index}`}>
              <line
                x1={margin.left}
                y1={tick.y}
                x2={chartWidth - margin.right}
                y2={tick.y}
                stroke="#374151"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.45"
              />
              <text
                x={margin.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#9ca3af"
              >
                {formatMoney(tick.value, currency, locale)}
              </text>
            </g>
          ))}

          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={chartHeight - margin.bottom}
            stroke="#d1d5db"
            strokeWidth="1.2"
          />
          <line
            x1={margin.left}
            y1={chartHeight - margin.bottom}
            x2={chartWidth - margin.right}
            y2={chartHeight - margin.bottom}
            stroke="#d1d5db"
            strokeWidth="1.2"
          />

          <polyline fill="none" stroke="#16a34a" strokeWidth="2.5" points={linePath} />

          {coordinates.map((point) => (
            <text
              key={`${point.year}-value`}
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#86efac"
            >
              {formatPointValue(point.monthlyTax)}
            </text>
          ))}

          {coordinates.map((point) => (
            <g key={point.year}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#22c55e"
                onMouseEnter={() => setHoveredYear(point.year)}
                onFocus={() => setHoveredYear(point.year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <title>
                  {point.year}: {formatMoney(point.monthlyTax, currency, locale)}
                </title>
              </circle>
              <text
                x={point.x}
                y={chartHeight - margin.bottom + 20}
                textAnchor="end"
                transform={`rotate(-28 ${point.x} ${chartHeight - margin.bottom + 20})`}
                fontSize="9"
                fill="#9ca3af"
              >
                {point.year}
              </text>
            </g>
          ))}

          <text
            x={chartWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#d1d5db"
          >
            Fiscal Year (x-axis)
          </text>
          <text
            x="18"
            y={chartHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90 18 ${chartHeight / 2})`}
            fontSize="11"
            fill="#d1d5db"
          >
            Monthly Tax (y-axis)
          </text>
        </svg>

        {hoveredPoint ? (
          <div className="pointer-events-none absolute right-3 top-3 rounded-input border border-border bg-surface px-2 py-1 text-[11px] text-text">
            {hoveredPoint.year}: {formatMoney(hoveredPoint.monthlyTax, currency, locale)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
