export type CalcState = {
  country: 'PK' | 'IN';
  year: string;
  salary: number;
  view: 'monthly' | 'yearly';
  regime?: 'default' | 'old' | 'new';
};

export function buildShareUrl(state: CalcState): string {
  const params = new URLSearchParams();
  params.set('country', state.country);
  params.set('year', state.year);
  params.set('salary', String(Math.max(0, Math.round(state.salary))));
  params.set('view', state.view);
  if (state.regime && state.regime !== 'default') {
    params.set('regime', state.regime);
  }

  const path = `/income-tax?${params.toString()}`;
  if (typeof window === 'undefined') {
    return path;
  }
  return `${window.location.origin}${path}`;
}

export function parseShareUrl(searchParams: URLSearchParams): Partial<CalcState> {
  const country = searchParams.get('country');
  const year = searchParams.get('year');
  const salaryParam = searchParams.get('salary');
  const view = searchParams.get('view');
  const regime = searchParams.get('regime');

  const parsed: Partial<CalcState> = {};

  if (country === 'PK' || country === 'IN') {
    parsed.country = country;
  }

  if (year && /^\d{4}-\d{4}$/.test(year)) {
    parsed.year = year;
  }

  if (salaryParam && /^\d+$/.test(salaryParam)) {
    parsed.salary = Number(salaryParam);
  }

  if (view === 'monthly' || view === 'yearly') {
    parsed.view = view;
  }

  if (regime === 'default' || regime === 'old' || regime === 'new') {
    parsed.regime = regime;
  }

  return parsed;
}
