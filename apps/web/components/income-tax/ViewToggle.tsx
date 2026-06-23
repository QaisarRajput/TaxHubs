type ViewToggleProps = {
  value: 'monthly' | 'yearly';
  onChange: (next: 'monthly' | 'yearly') => void;
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="rounded-full border border-border bg-surface-muted p-1">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={[
          'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
          value === 'monthly' ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text',
        ].join(' ')}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('yearly')}
        className={[
          'inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition',
          value === 'yearly' ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text',
        ].join(' ')}
      >
        Yearly
      </button>
    </div>
  );
}
