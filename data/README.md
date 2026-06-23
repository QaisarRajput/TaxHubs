# Tax Data

Data is stored in one file per country:
- pakistan.json
- india.json

Both files must match the CountryData schema from packages/schema.

## Add a new fiscal year
1. Prepend the newest fiscal year object to years.
2. Keep fiscalYear in YYYY-YYYY format.
3. Ensure defaultRegime exists in regimes.
4. Validate data before commit:

corepack pnpm validate

## Manual update workflow
1. Author the new fiscal-year entry in pakistan.json or india.json.
2. Validate with corepack pnpm validate.
3. Commit and push to main.
4. GitHub Actions deploy workflow builds and publishes the updated static site.

## Consultant CTA placeholders
Consultant links are configured in one place: [apps/web/lib/site-config.ts](apps/web/lib/site-config.ts) under `siteConfig.consultantCta.cards`.
Update the three `href` values there when a consultant partner is onboarded.
