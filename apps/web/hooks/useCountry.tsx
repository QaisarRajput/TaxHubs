'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { detectCountry } from '@/lib/country-detect';

type Country = 'PK' | 'IN';

type CountryContextValue = {
  country: Country;
  setCountry: (country: Country) => void;
};

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>('PK');

  useEffect(() => {
    const stored = localStorage.getItem('tax.country');
    if (stored === 'PK' || stored === 'IN') {
      setCountryState(stored);
      return;
    }

    const detected = detectCountry();
    if (detected) {
      setCountryState(detected);
      localStorage.setItem('tax.country', detected);
      return;
    }

    setCountryState('PK');
  }, []);

  const setCountry = useCallback((next: Country) => {
    setCountryState(next);
    localStorage.setItem('tax.country', next);
  }, []);

  const value = useMemo(() => ({ country, setCountry }), [country, setCountry]);

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountry(): [Country, (country: Country) => void] {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used inside CountryProvider');
  }

  return [context.country, context.setCountry];
}
