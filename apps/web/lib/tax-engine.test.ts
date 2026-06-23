import { describe, expect, it } from 'vitest';

import type { CountryDataType, TaxRegimeType } from '@tax/schema';
import indiaData from '../../../data/india.json';
import pakistanData from '../../../data/pakistan.json';
import { calculateFromMonthlySalary, calculateTax } from './tax-engine';

function findRegime(data: CountryDataType, fiscalYear: string, regimeId: string): TaxRegimeType {
  const year = data.years.find((entry) => entry.fiscalYear === fiscalYear);
  if (!year) {
    throw new Error(`Missing fiscal year ${fiscalYear}`);
  }
  const regime = year.regimes.find((entry) => entry.id === regimeId);
  if (!regime) {
    throw new Error(`Missing regime ${regimeId} for ${fiscalYear}`);
  }
  return regime;
}

describe('tax-engine', () => {
  it('Pakistan 2026-2027 salary 100K/month', () => {
    const regime = findRegime(pakistanData, '2026-2027', 'default');
    const result = calculateFromMonthlySalary(100000, regime);
    expect(Math.round(result.annual.totalTax)).toBe(6000);
    expect(Math.round(result.monthly.totalTax)).toBe(500);
  });

  it('Pakistan 2026-2027 salary 50K/month in 0% bracket', () => {
    const regime = findRegime(pakistanData, '2026-2027', 'default');
    const result = calculateFromMonthlySalary(50000, regime);
    expect(result.annual.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it('India 2025-2026 new regime 1M annual uses 87A rebate', () => {
    const regime = findRegime(indiaData, '2025-2026', 'new');
    const result = calculateTax(1000000, regime);
    expect(result.annual.incomeTax).toBe(0);
    expect(result.annual.totalTax).toBe(0);
  });

  it('India 2025-2026 new regime 1.5M annual has cess', () => {
    const regime = findRegime(indiaData, '2025-2026', 'new');
    const result = calculateTax(1500000, regime);
    expect(Math.round(result.annual.incomeTax)).toBe(125000);
    expect(Math.round(result.annual.cess)).toBe(5000);
    expect(Math.round(result.annual.totalTax)).toBe(130000);
  });

  it('India old regime 500K annual rebate wipes tax', () => {
    const regime = findRegime(indiaData, '2025-2026', 'old');
    const result = calculateTax(500000, regime);
    expect(result.annual.incomeTax).toBe(0);
    expect(result.annual.totalTax).toBe(0);
  });

  it('handles zero and slab boundary', () => {
    const regime = findRegime(pakistanData, '2026-2027', 'default');
    expect(calculateTax(0, regime).annual.totalTax).toBe(0);
    const boundary = calculateTax(600000, regime);
    expect(boundary.annual.totalTax).toBe(0);
  });
});
