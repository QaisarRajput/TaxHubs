'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { buildShareUrl, parseShareUrl, type CalcState } from '@/lib/share-url';

type UseCalculatorUrlProps = {
  state: CalcState;
  onHydrate: (value: Partial<CalcState>) => void;
};

export function useCalculatorUrl({ state, onHydrate }: UseCalculatorUrlProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const parsed = parseShareUrl(new URLSearchParams(window.location.search));
    if (Object.keys(parsed).length > 0) {
      onHydrate(parsed);
    }
  }, [onHydrate]);

  useEffect(() => {
    if (!state.year) {
      return;
    }

    const id = window.setTimeout(() => {
      const absolute = buildShareUrl(state);
      const url = new URL(absolute);
      const nextPath = `${pathname}?${url.searchParams.toString()}`;
      router.replace(nextPath, { scroll: false });
    }, 300);

    return () => window.clearTimeout(id);
  }, [pathname, router, state]);
}
