'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCountry } from '@/hooks/useCountry';
import { siteConfig } from '@/lib/site-config';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { TabNav } from './TabNav';
import { ThemeToggle } from './ThemeToggle';

type CountryPickerProps = {
  value: 'PK' | 'IN';
  onChange: (country: 'PK' | 'IN') => void;
};

function CountryPicker({ value, onChange }: CountryPickerProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value === 'IN' ? 'IN' : 'PK')}
      aria-label="Country"
      className="h-11 rounded-xl border border-border bg-surface px-3 text-sm text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      <option value="PK">🇵🇰 Pakistan</option>
      <option value="IN">🇮🇳 India</option>
    </select>
  );
}

export function AppBar() {
  const direction = useScrollDirection();
  const [country, setCountry] = useCountry();
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const activeTab =
    siteConfig.navigation.tabs.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))
      ?.href ?? '/income-tax';

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-surface/80 backdrop-blur-md transition-transform',
        direction === 'down' ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-4 py-2 md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0">
        <Link href="/income-tax" className="flex h-11 items-center gap-2 rounded-input px-1 text-text">
          <Image
            src={isDark ? siteConfig.brand.logoDark : siteConfig.brand.logo}
            alt="Tax logo"
            width={160}
            height={44}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <div className="flex justify-center md:flex-1">
          <TabNav tabs={siteConfig.navigation.tabs} activeHref={activeTab} />
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <CountryPicker value={country} onChange={setCountry} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
