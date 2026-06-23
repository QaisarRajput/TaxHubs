'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CountryDataType, TaxYearType } from '@tax/schema';

import { CalculatorForm } from '@/components/income-tax/CalculatorForm';
import { HeroBanner } from '@/components/income-tax/HeroBanner';
import { PreviousYearsTaxSparkline } from '@/components/income-tax/PreviousYearsTaxSparkline';
import { RegimeToggle } from '@/components/income-tax/RegimeToggle';
import { ResultSummary } from '@/components/income-tax/ResultSummary';
import { Skeleton } from '@/components/ui/Skeleton';
import { ViewToggle } from '@/components/income-tax/ViewToggle';
import { useCalculatorUrl } from '@/hooks/useCalculatorUrl';
import { useCountry } from '@/hooks/useCountry';
import { useTaxData } from '@/hooks/useTaxData';
import type { CalcState } from '@/lib/share-url';
import { calculateFromMonthlySalary, type TaxCalculationResult } from '@/lib/tax-engine';

const ShareButton = dynamic(
  () => import('@/components/income-tax/ShareButton').then((mod) => mod.ShareButton),
  {
    ssr: false,
    loading: () => <Skeleton className="h-20 w-full" />,
  },
);

const SlabBreakdown = dynamic(
  () => import('@/components/income-tax/SlabBreakdown').then((mod) => mod.SlabBreakdown),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  },
);

const SlabBarChart = dynamic(
  () => import('@/components/income-tax/SlabBarChart').then((mod) => mod.SlabBarChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full" />,
  },
);

const RegimeComparison = dynamic(
  () => import('@/components/income-tax/RegimeComparison').then((mod) => mod.RegimeComparison),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full" />,
  },
);

const YearComparison = dynamic(
  () => import('@/components/income-tax/YearComparison').then((mod) => mod.YearComparison),
  {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />,
  },
);

const ConsultantCTA = dynamic(
  () => import('@/components/income-tax/ConsultantCTA').then((mod) => mod.ConsultantCTA),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full" />,
  },
);

function findYear(data: CountryDataType, fiscalYear: string): TaxYearType {
  const year = data.years.find((entry) => entry.fiscalYear === fiscalYear) ?? data.years[0];
  if (!year) {
    throw new Error(`No tax years found for country ${data.country}`);
  }
  return year;
}

function pickRegimeId(country: 'PK' | 'IN', year: TaxYearType): 'default' | 'old' | 'new' {
  if (country === 'PK') {
    return 'default';
  }
  return year.defaultRegime === 'old' ? 'old' : 'new';
}

function previousFiscalYearLabel(currentFiscalYear: string): string | null {
  const match = /^(\d{4})-(\d{4})$/.exec(currentFiscalYear);
  if (!match) {
    return null;
  }

  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return null;
  }

  return `${start - 1}-${end - 1}`;
}

export function IncomeTaxCalculator() {
  const [country, setCountry] = useCountry();
  const { countryData, isLoading, error } = useTaxData(country);

  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  const [slabMode, setSlabMode] = useState<'progressive' | 'active'>('progressive');
  const [monthlySalary, setMonthlySalary] = useState(150000);
  const [fiscalYear, setFiscalYear] = useState('');
  const [regimeId, setRegimeId] = useState<'default' | 'old' | 'new'>('default');

  const year = useMemo(() => {
    if (!countryData) {
      return null;
    }
    return findYear(countryData, fiscalYear);
  }, [countryData, fiscalYear]);

  useEffect(() => {
    if (!countryData) {
      return;
    }

    const hasFiscalYear = countryData.years.some((entry) => entry.fiscalYear === fiscalYear);
    const resolvedYear = hasFiscalYear ? findYear(countryData, fiscalYear) : countryData.years[0];
    if (!resolvedYear) {
      return;
    }

    if (!hasFiscalYear) {
      setFiscalYear(resolvedYear.fiscalYear);
    }

    const hasRegime = resolvedYear.regimes.some((regime) => regime.id === regimeId);
    if (!hasRegime) {
      setRegimeId(pickRegimeId(country, resolvedYear));
    }
  }, [country, countryData, fiscalYear, regimeId]);

  const availableRegimes = year?.regimes ?? [];
  const activeRegime =
    availableRegimes.find((regime) => regime.id === regimeId) ??
    availableRegimes.find((regime) => (year ? regime.id === year.defaultRegime : false)) ??
    availableRegimes[0];

  const result: TaxCalculationResult | null = useMemo(() => {
    if (!activeRegime) {
      return null;
    }
    return calculateFromMonthlySalary(monthlySalary, activeRegime);
  }, [monthlySalary, activeRegime]);

  const onCountryChange = (next: 'PK' | 'IN') => {
    setCountry(next);
  };

  const onYearChange = (nextYear: string) => {
    setFiscalYear(nextYear);
    if (countryData) {
      const resolved = findYear(countryData, nextYear);
      setRegimeId(pickRegimeId(country, resolved));
    }
  };

  const currencySymbol = countryData?.currencySymbol ?? (country === 'IN' ? '₹' : '₨');

  const oldRegime = year?.regimes.find((regime) => regime.id === 'old');
  const newRegime = year?.regimes.find((regime) => regime.id === 'new');
  const oldRegimeResult = oldRegime ? calculateFromMonthlySalary(monthlySalary, oldRegime) : null;
  const newRegimeResult = newRegime ? calculateFromMonthlySalary(monthlySalary, newRegime) : null;

  const previousYearLabel = year ? previousFiscalYearLabel(year.fiscalYear) : null;
  const previousYear = previousYearLabel
    ? countryData?.years.find((entry) => entry.fiscalYear === previousYearLabel)
    : undefined;
  const previousRegime =
    previousYear?.regimes.find((regime) => regime.id === activeRegime?.id) ??
    previousYear?.regimes.find((regime) => regime.id === previousYear.defaultRegime) ??
    previousYear?.regimes[0];
  const previousYearResult = previousRegime
    ? calculateFromMonthlySalary(monthlySalary, previousRegime)
    : null;
  const yearlyDelta = previousYearResult && result
    ? result.annual.totalTax - previousYearResult.annual.totalTax
    : null;
  const yearlyDeltaPercent =
    previousYearResult && previousYearResult.annual.totalTax > 0
      ? ((yearlyDelta ?? 0) / previousYearResult.annual.totalTax) * 100
      : null;

  const previousYearsTrend = useMemo(() => {
    if (!countryData || !activeRegime || !year) {
      return [] as Array<{ year: string; monthlyTax: number }>;
    }

    return countryData.years
      .filter((entry) => entry.fiscalYear !== year.fiscalYear)
      .map((entry) => {
        const regimeForYear =
          entry.regimes.find((regime) => regime.id === activeRegime.id) ??
          entry.regimes.find((regime) => regime.id === entry.defaultRegime) ??
          entry.regimes[0];

        if (!regimeForYear) {
          return null;
        }

        const trendResult = calculateFromMonthlySalary(monthlySalary, regimeForYear);
        return {
          year: entry.fiscalYear,
          monthlyTax: trendResult.monthly.totalTax,
        };
      })
      .filter((point): point is { year: string; monthlyTax: number } => point !== null)
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [activeRegime, countryData, monthlySalary, year]);

  const hydrateFromUrl = useCallback(
    (value: Partial<CalcState>) => {
      if (value.country) {
        setCountry(value.country);
      }
      if (value.view) {
        setView(value.view);
      }
      if (typeof value.salary === 'number') {
        setMonthlySalary(value.salary);
      }
      if (value.year) {
        setFiscalYear(value.year);
      }
      if (value.regime) {
        setRegimeId(value.regime);
      }
    },
    [setCountry, setView, setMonthlySalary, setFiscalYear, setRegimeId],
  );

  const shareState: CalcState = {
    country,
    year: year?.fiscalYear ?? fiscalYear,
    salary: monthlySalary,
    view,
    regime: country === 'IN' ? (regimeId === 'old' ? 'old' : 'new') : 'default',
  };

  useCalculatorUrl({ state: shareState, onHydrate: hydrateFromUrl });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const tag = target.tagName.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target.isContentEditable;
      if (isEditable) {
        return;
      }

      const input = document.getElementById('monthly-salary-input');
      if (input instanceof HTMLInputElement) {
        event.preventDefault();
        input.focus();
        input.select();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const salaryError =
    !Number.isFinite(monthlySalary) || monthlySalary <= 0
      ? 'Please enter a salary greater than zero.'
      : monthlySalary > 100000000
        ? 'Salary should be 100,000,000 or less.'
        : null;

  if (error) {
    return (
      <section className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-4 py-5 md:py-6">
        <HeroBanner />
        <section className="rounded-card border border-danger/40 bg-surface p-5">
          <h2 className="text-lg font-semibold text-text">Unable to load tax data</h2>
          <p className="mt-2 text-sm text-text-muted">{error}</p>
        </section>
      </section>
    );
  }

  if (isLoading || !countryData || !year || !activeRegime || !result) {
    return (
      <section className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-4 py-5 md:py-6">
        <HeroBanner />
        <section className="rounded-card border border-border bg-surface p-5">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="mt-4 h-14 w-full" />
          <Skeleton className="mt-4 h-14 w-full" />
        </section>
        <section className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full md:col-span-2" />
        </section>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-4 py-5 md:gap-5 md:py-6">
      <HeroBanner />

      <div className="grid gap-4 min-[900px]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] min-[900px]:items-start">
        <div className="space-y-4">
          <CalculatorForm
            id="calculator-form"
            country={country}
            year={year.fiscalYear}
            years={countryData.years.map((entry) => entry.fiscalYear)}
            monthlySalary={monthlySalary}
            currencySymbol={currencySymbol}
            salaryError={salaryError}
            onCountryChange={onCountryChange}
            onYearChange={onYearChange}
            onSalaryChange={setMonthlySalary}
          />

          {country === 'IN' && year.regimes.length > 1 ? (
            <div className="rounded-card border border-border bg-surface p-4">
              <p className="mb-2 text-sm font-medium text-text">Regime</p>
              <RegimeToggle
                value={regimeId === 'old' ? 'old' : 'new'}
                onChange={(next) => setRegimeId(next)}
              />
            </div>
          ) : null}

          <div className="rounded-card border border-border bg-surface p-4">
            <p className="mb-2 text-sm font-medium text-text">View results as:</p>
            <ViewToggle value={view} onChange={setView} />

            <p className="mb-2 mt-4 text-sm font-medium text-text">Slab interpretation:</p>
            <div className="rounded-full border border-border bg-surface-muted p-1">
              <button
                type="button"
                onClick={() => setSlabMode('progressive')}
                className={[
                  'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
                  slabMode === 'progressive'
                    ? 'bg-accent text-accent-contrast'
                    : 'text-text-muted hover:text-text',
                ].join(' ')}
              >
                Progressive
              </button>
              <button
                type="button"
                onClick={() => setSlabMode('active')}
                className={[
                  'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
                  slabMode === 'active'
                    ? 'bg-accent text-accent-contrast'
                    : 'text-text-muted hover:text-text',
                ].join(' ')}
              >
                Active Bracket
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ResultSummary
            result={result}
            view={view}
            currency={countryData.currency}
            locale={countryData.locale}
          />

          {previousYear && previousYearResult && yearlyDeltaPercent !== null ? (
            <section className="rounded-card border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-wide text-text-muted">vs Previous Year</p>
              <p className="mt-1 text-sm text-text-muted">
                {year.fiscalYear} vs {previousYear.fiscalYear}
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <article className="rounded-input border border-border bg-surface-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-text-muted">Tax Change</p>
                  <p
                    className={[
                      'mt-1 text-3xl font-semibold leading-none [font-variant-numeric:tabular-nums]',
                      yearlyDeltaPercent <= 0 ? 'text-accent' : 'text-danger',
                    ].join(' ')}
                  >
                    {yearlyDeltaPercent > 0 ? '+' : ''}
                    {yearlyDeltaPercent.toFixed(1)}%
                  </p>
                </article>
                <article className="rounded-input border border-border bg-surface-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-text-muted">Annual Delta</p>
                  <p
                    className={[
                      'mt-1 text-xl font-semibold [font-variant-numeric:tabular-nums]',
                      (yearlyDelta ?? 0) <= 0 ? 'text-accent' : 'text-danger',
                    ].join(' ')}
                  >
                    {(yearlyDelta ?? 0) > 0 ? '+' : ''}
                    {new Intl.NumberFormat(countryData.locale, {
                      style: 'currency',
                      currency: countryData.currency,
                      maximumFractionDigits: 0,
                    }).format(yearlyDelta ?? 0)}
                  </p>
                </article>
              </div>
            </section>
          ) : null}

          <ShareButton state={shareState} disabled={Boolean(salaryError)} />
        </div>
      </div>

      <PreviousYearsTaxSparkline
        points={previousYearsTrend}
        currency={countryData.currency}
        locale={countryData.locale}
      />

      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] min-[1100px]:items-start">
        <SlabBreakdown
          result={result}
          view={view}
          mode={slabMode}
          currency={countryData.currency}
          locale={countryData.locale}
        />

        <SlabBarChart result={result} currency={countryData.currency} locale={countryData.locale} />
      </div>

      {country === 'IN' && oldRegimeResult && newRegimeResult ? (
        <RegimeComparison
          oldResult={oldRegimeResult}
          newResult={newRegimeResult}
          currency={countryData.currency}
          locale={countryData.locale}
        />
      ) : null}

      <ConsultantCTA />
    </section>
  );
}
