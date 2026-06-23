import { z } from 'zod';

export const TaxSlab = z.object({
  min: z.number().nonnegative(),
  max: z.number().positive().nullable(),
  rate: z.number().min(0).max(1),
  fixedAmount: z.number().nonnegative().default(0),
});

export const TaxRegime = z.object({
  id: z.enum(['default', 'old', 'new']),
  label: z.string(),
  slabs: z.array(TaxSlab).min(1),
  standardDeduction: z.number().nonnegative().default(0),
  surcharge: z
    .array(
      z.object({
        threshold: z.number(),
        rate: z.number(),
      }),
    )
    .default([]),
  rebate87A: z
    .object({
      maxIncome: z.number(),
      amount: z.number(),
    })
    .nullable()
    .default(null),
  cess: z.number().nonnegative().default(0),
  notes: z.string().optional(),
});

export const TaxYear = z.object({
  country: z.enum(['PK', 'IN']),
  fiscalYear: z.string().regex(/^\d{4}-\d{4}$/),
  currency: z.enum(['PKR', 'INR']),
  regimes: z.array(TaxRegime).min(1),
  defaultRegime: z.string(),
});

export const CountryData = z.object({
  country: z.enum(['PK', 'IN']),
  currency: z.enum(['PKR', 'INR']),
  currencySymbol: z.string(),
  locale: z.string(),
  years: z.array(TaxYear).min(1),
});

export type TaxSlab = z.infer<typeof TaxSlab>;
export type TaxRegime = z.infer<typeof TaxRegime>;
export type TaxYear = z.infer<typeof TaxYear>;
export type CountryData = z.infer<typeof CountryData>;
