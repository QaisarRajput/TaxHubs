export type BlogCountry = 'PK' | 'IN';

export type BlogArticle = {
  slug: string;
  country: BlogCountry;
  title: string;
  description: string;
  body: string[];
};

export const blogArticles: BlogArticle[] = [
  {
    slug: 'pk-salary-tax-filing-guide-2026-2027',
    country: 'PK',
    title: 'Pakistan Salary Tax Filing Guide (2026-2027)',
    description: 'A simple filing path for salaried taxpayers in Pakistan for tax year 2026-2027.',
    body: [
      'Start by collecting salary slips, annual tax certificate, and any withholding proofs from banks or employers.',
      'Confirm your annual taxable salary and compare it against the slab shown in the calculator for your selected year.',
      'Use the calculator result as a pre-check before filing, then submit the return on the official FBR portal and keep a copy of the acknowledgement.',
    ],
  },
  {
    slug: 'pk-withholding-and-adjustable-tax-checklist',
    country: 'PK',
    title: 'Pakistan Withholding and Adjustable Tax Checklist',
    description: 'How to reconcile withholding entries and avoid paying tax twice.',
    body: [
      'Track tax withheld at source from salary, banking transactions, and other covered payments in one worksheet.',
      'When preparing your annual return, match each withheld entry with your records so that adjustable tax is properly credited.',
      'If mismatches appear, resolve them before final submission to reduce refund delays or future notices.',
    ],
  },
  {
    slug: 'in-old-vs-new-regime-how-to-decide',
    country: 'IN',
    title: 'India Old vs New Regime: How to Decide',
    description: 'A practical decision framework for selecting the right regime in India.',
    body: [
      'Use the calculator to compare old and new regime outcomes at your current monthly or yearly income.',
      'If you claim multiple deductions and exemptions, old regime may remain competitive; otherwise new regime is often simpler.',
      'Review the final tax, take-home, and effective rate for both options before locking your filing approach.',
    ],
  },
  {
    slug: 'in-itr-filing-checklist-for-salaried-users',
    country: 'IN',
    title: 'India ITR Filing Checklist for Salaried Users',
    description: 'A quick checklist to make income tax return filing smoother.',
    body: [
      'Collect Form 16, AIS/TIS references, bank interest details, and supporting documents for deductions you plan to claim.',
      'Reconcile taxable income and tax paid with your chosen regime before submitting the return.',
      'After filing, verify the return promptly and save acknowledgement files for records and future loan or visa documentation.',
    ],
  },
];

export function getBlogBySlug(slug: string): BlogArticle | null {
  return blogArticles.find((article) => article.slug === slug) ?? null;
}

export function getBlogsByCountry(country: BlogCountry): BlogArticle[] {
  return blogArticles.filter((article) => article.country === country);
}
