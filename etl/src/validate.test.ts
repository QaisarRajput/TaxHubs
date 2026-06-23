import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runValidation } from './validate';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

async function setupData(files: Record<string, unknown>): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'tax-etl-'));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(([name, value]) =>
      writeFile(path.join(dir, name), JSON.stringify(value, null, 2), 'utf8'),
    ),
  );

  return dir;
}

describe('runValidation', () => {
  it('passes on valid fixtures', async () => {
    const base = {
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
              slabs: [{ min: 0, max: 1, rate: 0, fixedAmount: 0 }],
              standardDeduction: 0,
              surcharge: [],
              rebate87A: null,
              cess: 0,
            },
          ],
        },
      ],
    };

    const dir = await setupData({
      'pakistan.json': base,
      'india.json': { ...base, country: 'IN', currency: 'INR', locale: 'en-IN' },
    });

    const issues = await runValidation(dir);
    expect(issues).toHaveLength(0);
  });

  it('returns issue for mismatched default regime', async () => {
    const invalid = {
      country: 'PK',
      currency: 'PKR',
      currencySymbol: 'Rs',
      locale: 'ur-PK',
      years: [
        {
          country: 'PK',
          fiscalYear: '2026-2027',
          currency: 'PKR',
          defaultRegime: 'missing',
          regimes: [
            {
              id: 'default',
              label: 'Default',
              slabs: [{ min: 0, max: 1, rate: 0, fixedAmount: 0 }],
              standardDeduction: 0,
              surcharge: [],
              rebate87A: null,
              cess: 0,
            },
          ],
        },
      ],
    };

    const dir = await setupData({ 'pakistan.json': invalid, 'india.json': invalid });
    const issues = await runValidation(dir);

    expect(issues.some((issue) => issue.path.includes('defaultRegime'))).toBe(true);
  });
});
