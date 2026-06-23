'use client';

import { useRef } from 'react';

type RegimeToggleProps = {
  value: 'old' | 'new';
  onChange: (value: 'old' | 'new') => void;
};

export function RegimeToggle({ value, onChange }: RegimeToggleProps) {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;

    if (startX === null || endX === null) {
      return;
    }

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      onChange('new');
    } else {
      onChange('old');
    }
  };

  return (
    <div
      className="rounded-full border border-border bg-surface-muted p-1"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={() => onChange('new')}
        className={[
          'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
          value === 'new' ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text',
        ].join(' ')}
      >
        New Regime
      </button>
      <button
        type="button"
        onClick={() => onChange('old')}
        className={[
          'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
          value === 'old' ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text',
        ].join(' ')}
      >
        Old Regime
      </button>
    </div>
  );
}
