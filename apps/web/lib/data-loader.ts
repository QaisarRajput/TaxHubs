import { CountryData, type CountryDataType } from '@tax/schema';

type CountryCode = 'PK' | 'IN';

const dataCache: Partial<Record<CountryCode, CountryDataType>> = {};
const inflightCache: Partial<Record<CountryCode, Promise<CountryDataType>>> = {};

async function importCountryJson(country: CountryCode) {
  if (country === 'IN') {
    return (await import('../../../data/india.json')).default;
  }
  return (await import('../../../data/pakistan.json')).default;
}

export function getCachedCountryData(country: CountryCode): CountryDataType | null {
  return dataCache[country] ?? null;
}

export async function loadCountryData(country: CountryCode): Promise<CountryDataType> {
  const cached = dataCache[country];
  if (cached) {
    return cached;
  }

  const inFlight = inflightCache[country];
  if (inFlight) {
    return inFlight;
  }

  const promise = importCountryJson(country).then((json) => {
    const parsed = CountryData.parse(json) as CountryDataType;
    dataCache[country] = parsed;
    delete inflightCache[country];
    return parsed;
  });

  inflightCache[country] = promise;
  return promise;
}

export function preloadCountryData(country: CountryCode): void {
  void loadCountryData(country);
}
