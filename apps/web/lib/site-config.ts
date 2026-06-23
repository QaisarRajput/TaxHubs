export const siteConfig = {
  brand: {
    logo: '/assets/brand/logo.png',
    logoDark: '/assets/brand/logo-dark.png',
    banner: '/assets/brand/banner.png',
    favicon: '/assets/brand/favicon.ico',
  },
  navigation: {
    tabs: [
      { label: 'Income Tax', href: '/income-tax' },
      { label: 'Blogs', href: '/blogs' },
    ],
    footerLinks: [
      { label: 'Income Tax', href: '/income-tax' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Copyright', href: '/copyright' },
      { label: 'Continues', href: '/continues' },
    ],
  },
  seo: {
    siteTitle: 'Tax Calculator - Income Tax',
    siteDescription: 'Free income tax calculator with slab-wise breakdowns and yearly/monthly views.',
    incomeTaxTitle: 'Income Tax Calculator 2025-26 | tax.hubs.dpdns.org',
    incomeTaxDescription: 'Calculate income tax instantly with detailed slab-wise results.',
    ogImageAlt: 'Income Tax Calculator preview card',
    siteUrl: 'https://tax.hubs.dpdns.org',
  },
  hero: {
    tag: 'Income Tax',
    title: 'Income Tax Calculator',
    slogans: [
      'Know Your Numbers. Keep More of What You Earn.',
      "Taxes Don't Have to Be Taxing.",
      'Transparent. Accurate. Instant.',
      'Built for clarity across countries and tax years.',
    ],
    description:
      'Free income tax calculator with instant slab-wise breakdowns in monthly and yearly views.',
    statsLine: 'Multi-year support · Multi-country ready · 100% free',
  },
  consultantCta: {
    cards: [
      {
        title: 'Contact a Tax Agent',
        description: 'Speak to a certified tax consultant for personalized advice.',
        label: 'Find an Agent ->',
        href: '#',
        variant: 'primary',
      },
      {
        title: 'Become a Tax Filer',
        description:
          'Filing your returns keeps you compliant and unlocks benefits. We will show you how.',
        label: 'Start Filing ->',
        href: '#',
        variant: 'outline',
      },
      {
        title: 'We will File For You',
        description:
          'Let our partner consultants handle your entire tax return from start to finish.',
        label: 'Get Started ->',
        href: '#',
        variant: 'primary',
      },
    ],
  },
  footer: {
    referenceLinks: [
      {
        label: 'Tax Policy Resources',
        href: 'https://www.oecd.org/tax/',
      },
      {
        label: 'Fiscal Policy Resources',
        href: 'https://www.imf.org/en/Topics/fiscal-policies',
      },
    ],
    socialLinks: [
      {
        platform: 'x',
        label: 'Follow on X',
        href: 'https://x.com',
      },
      {
        platform: 'linkedin',
        label: 'Connect on LinkedIn',
        href: 'https://linkedin.com',
      },
      {
        platform: 'whatsapp',
        label: 'Share on WhatsApp',
        href: 'https://wa.me/?text=Check%20out%20this%20tax%20calculator%3A%20https%3A%2F%2Ftax.hubs.dpdns.org',
      },
    ],
  },
} as const;
