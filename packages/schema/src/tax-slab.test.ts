import { describe, expect, it } from 'vitest';

import { CountryData } from './tax-slab';

describe('CountryData schema', () => {
  it('parses a valid record', () => {
    const parsed = CountryData.parse({
      country: 'PK',
      currency: 'PKR',
      currencySymbol: 'Rs',
      locale: 'ur-PK',
      years: [
        {
          country: 'PK',
          fiscalYear: '2026-2027',
          currency: 'PKR',
          defaultRegime: 'default',
          regimes: [
            {
              id: 'default',
              label: 'Default',
              slabs: [{ min: 0, max: 600000, rate: 0, fixedAmount: 0 }],
              standardDeduction: 0,
              surcharge: [],
              rebate87A: null,
              cess: 0,
            },
          ],
        },
      ],
    });

    expect(parsed.country).toBe('PK');
    expect(parsed.years).toHaveLength(1);
  });

  it('throws on invalid year format', () => {
    const result = CountryData.safeParse({
      country: 'PK',
      currency: 'PKR',
      currencySymbol: 'Rs',
      locale: 'ur-PK',
      years: [
        {
          country: 'PK',
          fiscalYear: 'FY26',
          currency: 'PKR',
          defaultRegime: 'default',
          regimes: [
            {
              id: 'default',
              label: 'Default',
              slabs: [{ min: 0, max: 600000, rate: 0, fixedAmount: 0 }],
              standardDeduction: 0,
              surcharge: [],
              rebate87A: null,
              cess: 0,
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
