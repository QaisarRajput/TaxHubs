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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-surface/80 backdrop-blur-md transition-transform',
        direction === 'down' ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 py-2 md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0">
        <div className="flex h-12 items-center justify-between gap-2">
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

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text md:hidden"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-5">
              <span
                className={[
                  'absolute left-0 top-0 block h-0.5 w-5 bg-current transition-transform',
                  isMenuOpen ? 'translate-y-[7px] rotate-45' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'absolute left-0 top-[7px] block h-0.5 w-5 bg-current transition-opacity',
                  isMenuOpen ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              />
              <span
                className={[
                  'absolute left-0 top-[14px] block h-0.5 w-5 bg-current transition-transform',
                  isMenuOpen ? '-translate-y-[7px] -rotate-45' : '',
                ].join(' ')}
              />
            </span>
          </button>
        </div>

        <div className="hidden justify-center md:flex md:flex-1">
          <TabNav tabs={siteConfig.navigation.tabs} activeHref={activeTab} />
        </div>

        <div className="hidden items-center gap-2 md:flex md:justify-end">
          <CountryPicker value={country} onChange={setCountry} />
          <ThemeToggle />
        </div>

        <div
          id="mobile-nav-menu"
          className={[
            'grid overflow-hidden border-t border-border/70 transition-all md:hidden',
            isMenuOpen ? 'mt-2 max-h-80 py-3 opacity-100' : 'max-h-0 py-0 opacity-0',
          ].join(' ')}
        >
          <div className="flex flex-col gap-2">
            {siteConfig.navigation.tabs.map((tab) => {
              const active = tab.href === activeTab;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={[
                    'inline-flex h-11 items-center rounded-input px-3 text-sm font-medium transition',
                    active ? 'bg-accent text-accent-contrast' : 'text-text hover:bg-surface-muted',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              );
            })}

            <div className="mt-1 flex items-center justify-between gap-2">
              <CountryPicker value={country} onChange={setCountry} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
