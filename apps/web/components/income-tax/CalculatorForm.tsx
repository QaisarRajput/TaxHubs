import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Select } from '@/components/ui/Select';

type CalculatorFormProps = {
  id?: string;
  country: 'PK' | 'IN';
  year: string;
  years: string[];
  monthlySalary: number;
  currencySymbol: string;
  salaryError?: string | null;
  onCountryChange: (country: 'PK' | 'IN') => void;
  onYearChange: (year: string) => void;
  onSalaryChange: (value: number) => void;
};

export function CalculatorForm({
  id,
  country,
  year,
  years,
  monthlySalary,
  currencySymbol,
  salaryError,
  onCountryChange,
  onYearChange,
  onSalaryChange,
}: CalculatorFormProps) {
  const salaryErrorId = salaryError ? 'salary-error' : undefined;
  const salaryA11yProps = salaryErrorId
    ? { describedBy: salaryErrorId, invalid: true }
    : { invalid: false };

  return (
    <section id={id} className="rounded-card border border-border bg-surface p-5">
      <h2 className="sr-only">Calculator Inputs</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Country"
          value={country}
          onChange={(value) => onCountryChange(value === 'IN' ? 'IN' : 'PK')}
          options={[
            { label: '🇵🇰 Pakistan', value: 'PK' },
            { label: '🇮🇳 India', value: 'IN' },
          ]}
        />
        <Select
          label="Fiscal Year"
          value={year}
          onChange={onYearChange}
          options={years.map((value) => ({ label: value, value }))}
        />
      </div>
      <div className="mt-4">
        <CurrencyInput
          label="Monthly Salary"
          inputId="monthly-salary-input"
          value={monthlySalary}
          symbol={currencySymbol}
          {...salaryA11yProps}
          onChange={onSalaryChange}
        />
        {salaryError ? (
          <p id="salary-error" className="mt-2 text-sm text-danger">
            {salaryError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
