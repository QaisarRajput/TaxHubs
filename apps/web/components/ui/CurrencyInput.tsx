import { useEffect, useState } from 'react';

type CurrencyInputProps = {
  label: string;
  value: number;
  symbol: string;
  inputId?: string;
  describedBy?: string;
  invalid?: boolean;
  onChange: (value: number) => void;
};

export function CurrencyInput({
  label,
  value,
  symbol,
  inputId,
  describedBy,
  invalid,
  onChange,
}: CurrencyInputProps) {
  const [draftValue, setDraftValue] = useState(
    Number.isFinite(value) && value > 0 ? String(value) : '',
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      return;
    }

    setDraftValue(Number.isFinite(value) && value > 0 ? String(value) : '');
  }, [isFocused, value]);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text">{label}</span>
      <div className="flex h-14 items-center rounded-input border border-border bg-surface px-3">
        <span className="mr-2 text-text-muted">{symbol}</span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-invalid={invalid ? 'true' : 'false'}
          aria-describedby={describedBy}
          value={draftValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!draftValue) {
              onChange(0);
              return;
            }

            const normalized = String(Math.max(0, Math.round(Number(draftValue))));
            setDraftValue(normalized);
            onChange(Number(normalized));
          }}
          onChange={(event) => {
            const digitsOnly = event.target.value.replace(/\D+/g, '');
            setDraftValue(digitsOnly);

            if (!digitsOnly) {
              return;
            }

            onChange(Number(digitsOnly));
          }}
          placeholder="Enter your monthly salary"
          className="w-full bg-transparent text-base text-text outline-none"
        />
      </div>
    </label>
  );
}
