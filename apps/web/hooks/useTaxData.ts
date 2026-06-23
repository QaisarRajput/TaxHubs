'use client';

import { useEffect, useMemo, useState } from 'react';

import { getCachedCountryData, loadCountryData, preloadCountryData } from '@/lib/data-loader';
import type { CountryDataType } from '@tax/schema';

type CountryCode = 'PK' | 'IN';

type UseTaxDataResult = {
  countryData: CountryDataType | null;
  isLoading: boolean;
  error: string | null;
};

export function useTaxData(country: CountryCode): UseTaxDataResult {
  const initial = useMemo(() => getCachedCountryData(country), [country]);
  const [countryData, setCountryData] = useState<CountryDataType | null>(initial);
  const [isLoading, setIsLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getCachedCountryData(country);
    if (cached) {
      setCountryData(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    loadCountryData(country)
      .then((data) => {
        if (!cancelled) {
          setCountryData(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setCountryData(null);
          setIsLoading(false);
          setError(err instanceof Error ? err.message : 'Unable to load tax data.');
        }
      });

    const otherCountry: CountryCode = country === 'PK' ? 'IN' : 'PK';
    preloadCountryData(otherCountry);

    return () => {
      cancelled = true;
    };
  }, [country]);

  return { countryData, isLoading, error };
}
