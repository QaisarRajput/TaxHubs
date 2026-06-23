import type { CountryDataType } from '@tax/schema';

import { loadCountryData } from '@/lib/data-loader';

export async function getCountryData(country: 'PK' | 'IN'): Promise<CountryDataType> {
  return loadCountryData(country);
}

export async function availableYears(country: 'PK' | 'IN'): Promise<string[]> {
  const data = await getCountryData(country);
  return data.years.map((entry) => entry.fiscalYear);
}
