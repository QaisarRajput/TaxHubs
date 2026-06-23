import Link from 'next/link';

type Tab = {
  label: string;
  href: string;
};

type TabNavProps = {
  tabs: ReadonlyArray<Tab>;
  activeHref: string;
};

export function TabNav({ tabs, activeHref }: TabNavProps) {
  return (
    <nav aria-label="Primary tabs" className="inline-flex rounded-full border border-border bg-surface-muted p-1">
      {tabs.map((tab) => {
        const active = tab.href === activeHref;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[
              'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
              active
                ? 'bg-accent text-accent-contrast'
                : 'text-text-muted hover:bg-surface hover:text-text',
            ].join(' ')}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
