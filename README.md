# Tax Calculator Monorepo

A multi-country tax calculator platform built with Next.js, TypeScript, and shared schema validation.

## What This Repo Contains

- `apps/web`: Next.js web app (income tax calculator, blogs, legal pages)
- `packages/schema`: Shared Zod schema/types for tax data
- `etl`: Data validation and transformation utilities
- `data`: Country/year tax slab datasets used by the web app
- `docs`: Project documentation and implementation notes

## Key Features

- Country-aware calculator experience (Pakistan and India)
- Fiscal-year and regime-aware tax computation
- Monthly and yearly result views
- Slab breakdown views:
  - Progressive (recommended)
  - Active bracket (quick bracket-only view)
- Shareable calculator URLs
- Country-specific blog routes with static generation
- SEO metadata, sitemap, and static legal/support pages

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS
- Zod
- Vitest
- pnpm workspaces

## Prerequisites

- Node.js 20+
- Corepack enabled (`corepack enable`)

## Setup

```bash
corepack pnpm install
```

## Run Locally

```bash
corepack pnpm dev
```

Web app runs at `http://localhost:3000`.

## Quality Checks

```bash
corepack pnpm test
corepack pnpm --filter web build
corepack pnpm validate
```

## Brand Assets

Place brand files in:

- `apps/web/public/assets/brand/logo.png`
- `apps/web/public/assets/brand/logo-dark.png`
- `apps/web/public/assets/brand/banner.png`

These are used in header branding, hero backgrounds, and metadata images (Open Graph/Twitter/icons).

## Notes

- Tax calculations are informational and not financial advice.
- Official filing should always be completed using relevant government portals.

## License and Usage Restrictions

Copyright (c) 2026 tax.hubs.dpdns.org. All rights reserved.

- No scraping, crawling, bulk extraction, or automated collection of site or repository content.
- No AI/ML training, dataset creation, model fine-tuning, or derivative datasets using this content.
- No reuse, redistribution, relicensing, or publication of source code without prior written permission.

See `LICENSE` and the website Terms page for full legal terms.
