# Implementation Plan — tax.hubs.dpdns.org · Income Tax Calculator

> **Agent instructions:** Read `docs/instructions.md` first and treat every rule there as a hard constraint. This plan uses the same checkbox conventions: `[ ]` not started · `[~]` in progress · `[x]` complete.

---

## §0 Source / Data Validation

### Confirmed data facts

**Pakistan (source: FBR / taxcalculator.pk)**

| Fiscal Year | Slabs | Notes |
|---|---|---|
| 2026-2027 | 8 | Latest; 0%, 1%, 11%, 20%, 25%, 29%, 32%, 35% |
| 2025-2026 | 6 | 9% surcharge if income > 10M |
| 2024-2025 | 6 | Higher rates than 2025-26 |
| 2023-2024 | 6 | Baseline post-reform |
| 2022-2023 | 6 | Same structure as 2023-24 |
| 2021-2022 | 10 | Many fine-grained slabs |
| 2020-2021 | 10 | Same structure |
| 2019-2020 | 10 | Same structure |
| 2018-2019 | 8 | Fixed-amount bottom slabs |
| 2017-2018 | 9 | Fine-grained low-income slabs |
| 2016-2017 | 9 | Same as 2017-18 |
| 2015-2016 | 9 | Same structure |
| 2014-2015 | 9 | Oldest tracked year |

Currency: PKR. Fiscal year: July 1 – June 30.

**India (source: Income Tax Act, Finance Acts)**

Two parallel regimes exist from FY 2020-21 onward:
- **Old Regime**: Standard deductions apply (80C, HRA, etc.), more slabs.
- **New Regime** (default from FY 2023-24): Simplified slabs, standard deduction ₹75,000 (FY 2024-25+).

| Fiscal Year | Regime | Key rates |
|---|---|---|
| 2025-2026 | New | 0% ≤3L, 5% 3-7L, 10% 7-10L, 15% 10-12L, 20% 12-15L, 30% >15L + Rebate 87A up to ₹12L |
| 2025-2026 | Old | 0% ≤2.5L, 5% 2.5-5L, 20% 5-10L, 30% >10L |
| 2024-2025 | New | 0% ≤3L, 5% 3-7L, 10% 7-10L, 15% 10-12L, 20% 12-15L, 30% >15L + Rebate 87A up to ₹7L |
| 2024-2025 | Old | Same as above old |
| 2023-2024 | New | 0% ≤3L, 5% 3-6L, 10% 6-9L, 15% 9-12L, 20% 12-15L, 30% >15L + Rebate 87A up to ₹7L |
| 2022-2023 | Old only (default) | 0% ≤2.5L, 5% 2.5-5L, 20% 5-10L, 30% >10L |
| 2021-2022 | Both | New regime introduced |
| 2020-2021 | Both | New regime first year |

Standard deduction (salaried): ₹50,000 (FY 2020-23), ₹75,000 (FY 2024-25+, new regime).  
Health & Education Cess: 4% on tax (all years).  
Surcharge: Progressive (10%/15%/25%/37%) on high income.  
Currency: INR. Fiscal year: April 1 – March 31.

### §0.1 — ID strategy for tax data records

Tax data lives in **two files only**: `data/pakistan.json` and `data/india.json`. Each file is a `CountryData` object containing a `years` array of `TaxYear` records. Within a `TaxYear`, slabs are indexed by position — stable because slabs are ordered by lower bound and never re-ordered. Years within the array are ordered newest-first (most recent at index 0). Fiscal year string format: `"2024-2025"` (ISO range, never `"FY24"` shorthand). This structure means adding a new fiscal year = appending one object to the front of the `years` array in one file, then running `pnpm validate`.

### §0.2 — Country detection mechanism

Use the [`Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) API (available in all modern browsers) to read `navigator.language` at client init. Map `pk` → Pakistan, `in` → India. Fallback to Pakistan if unresolvable. Store preference in `localStorage` as `tax.country`. Never call a geolocation API — no network round-trip, no permission prompt.

### §0.3 — Static export constraint for country detection

Country detection is purely client-side (runs after hydration). The static page shell renders with Pakistan as default. A `useEffect` on mount reads `navigator.language` + `localStorage`, resolves the country, and updates state — resulting in a single client-side patch on first load with no visible flash for returning users (persisted in localStorage).

### §0.4 — India dual-regime handling

For India, the calculator shows **both** old and new regime results side-by-side when the selected year supports dual regimes (FY 2020-21+). A toggle allows the user to select which is their primary view. For years before FY 2020-21 only the old regime is shown and the toggle is hidden.

### §0.5 — Shareable URL state

All calculator inputs are encoded in the URL query string so any calculation can be shared as a direct link. Parameters: `?country=PK&year=2026-2027&salary=150000&view=monthly`. On page load, query params take precedence over localStorage defaults. Writing to query params uses `router.replace` (no push — no history pollution). The URL updates on every input change (debounced 300ms). This also means the browser Back button is not broken by every keystroke.

### §0.6 — Monthly vs yearly view

All result figures are computed annually internally, then displayed monthly or yearly depending on a toggle the user controls. The toggle state is persisted in both `localStorage` (for returning users) and the shareable URL (`&view=monthly` or `&view=yearly`). Default view is monthly (matches how people think about salary).

---

## Guiding Principles

1. **pnpm monorepo** — never npm or yarn. Workspaces: `apps/web`, `packages/schema`, `etl/`.
2. **Next.js `output: 'export'`** — 100% static, no server, no ISR. Deployed to GitHub Pages.
3. **Zod schemas in `packages/schema`** — single source of truth for all data types.
4. **`data/` is committed and version-controlled** — manually authored JSON, never `.gitignore`d.
5. **TypeScript strict mode** — `strict: true`, `noUncheckedIndexedAccess`, no `any` without comment.
6. **Design tokens first** — CSS custom properties defined before any component is written.
7. **Animations behind `prefers-reduced-motion`** — every motion effect is gated.
8. **WCAG 2.1 AA** — color contrast, keyboard nav, semantic HTML, 44px touch targets.
9. **No ETL pipeline needed** — data is manually authored JSON; no scheduled CI sync. `etl/` workspace exists but only runs a validation + type-check script.
10. **Tab-extensible architecture** — the Income Tax calculator is a tab inside a `TaxApp` shell. New tax types (GST, Capital Gains, etc.) are additional tabs, not separate pages.
11. **Green + neutral palette** — money-linked green as primary accent. Full dark/light theme via CSS custom properties + Tailwind `darkMode: 'class'`.
12. **One JSON per country** — `data/pakistan.json` and `data/india.json`. All fiscal years live as an array inside each file. Never split into per-year files.
13. **URL-first state** — calculator inputs (country, year, salary, view mode) live in the URL query string. Share button copies the current URL. No server needed.
14. **Monthly/yearly toggle** — all outputs support both views. Monthly is default. Toggle persists to URL and localStorage.

---

## Design System Specification

### Color Tokens

```css
/* ── Light ── */
--bg:              #F7FAF7;   /* very slight green tint on white */
--surface:         #FFFFFF;
--surface-muted:   #EFF5EF;
--text:            #111814;
--text-muted:      #5A6B5A;
--border:          #D6E5D6;
--accent:          #16A34A;   /* green-600 — primary CTA, active state */
--accent-hover:    #15803D;   /* green-700 */
--accent-soft:     #DCFCE7;   /* green-100 — chip backgrounds */
--accent-contrast: #FFFFFF;
--danger:          #DC2626;   /* red-600 — error states */
--warn:            #D97706;   /* amber-600 — info callouts */

/* ── Dark ── */
--bg:              #0D110D;
--surface:         #141A14;
--surface-muted:   #1C241C;
--text:            #E8F5E8;
--text-muted:      #7A9A7A;
--border:          #2A3A2A;
--accent:          #22C55E;   /* green-500 — brighter for dark contrast */
--accent-hover:    #16A34A;
--accent-soft:     #14532D;   /* green-900 */
--accent-contrast: #0D110D;
--danger:          #EF4444;
--warn:            #F59E0B;
```

Wire into Tailwind via `theme.extend.colors` using the CSS vars.

### Typography

- UI font: `Inter` variable via `next/font/google` (self-hosted).
- Number / data font: `JetBrains Mono` for tax amounts (monospaced, prevents layout shift on update).
- Type scale: fluid `clamp()` — e.g. body `clamp(0.9rem, 1vw + 0.5rem, 1.0625rem)`.

### Motion

- Page-level transitions: opacity fade (200ms) + subtle upward translate (8px → 0).
- Calculator result reveal: staggered slide-in per row (30ms delay between items).
- Number counters: smooth count-up animation on result change (via `react-spring` or CSS `@keyframes counter`).
- Slab bar chart: width animate from 0 → final on mount/update.
- Theme toggle: morphing sun/moon SVG icon.
- All effects gated: `@media (prefers-reduced-motion: no-preference)`.

### Spacing & Radii

- Base scale: 4px. Use Tailwind spacing (1=4px, 2=8px, …, 16=64px).
- Card radius: `rounded-2xl` (16px).
- Input/button radius: `rounded-xl` (12px).
- Badge/pill: `rounded-full`.

### Layout

- Max content width: 1280px, centered.
- Calculator panel: max 720px, centered on desktop; full-width on mobile.
- 3-column breakdown grid on desktop, 1-column on mobile.

---

## Project Structure

```
tax/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx              # Root layout: fonts, theme script, app bar, footer
│       │   ├── page.tsx                # Home → redirects to /income-tax
│       │   ├── sitemap.ts
│       │   ├── income-tax/
│       │   │   └── page.tsx            # Income tax calculator tab
│       │   └── not-found.tsx
│       ├── components/
│       │   ├── app-shell/
│       │   │   ├── AppBar.tsx          # Sticky nav: logo, tab switcher, theme toggle, country picker
│       │   │   ├── TabNav.tsx          # Horizontal tab strip (Income Tax, …future tabs…)
│       │   │   ├── ThemeToggle.tsx
│       │   │   └── Footer.tsx          # Full footer: data credits, social links, disclaimer
│       │   ├── income-tax/
│       │   │   ├── HeroBanner.tsx      # Full-width hero: slogan, animated stats, CTA
│       │   │   ├── CalculatorForm.tsx  # Salary input + fiscal year dropdown + country select
│       │   │   ├── ViewToggle.tsx      # Monthly ↔ Yearly display toggle
│       │   │   ├── ResultSummary.tsx   # Summary cards: tax, take-home, effective rate
│       │   │   ├── SlabBreakdown.tsx   # Animated table with monthly+yearly columns
│       │   │   ├── SlabBarChart.tsx    # Visual bar chart of each slab's contribution
│       │   │   ├── RegimeToggle.tsx    # India only: Old vs New regime
│       │   │   ├── YearComparison.tsx  # Compare current year vs prior year
│       │   │   ├── ShareButton.tsx     # Copy shareable URL to clipboard
│       │   │   └── ConsultantCTA.tsx   # CTA cards: Contact Agent, Become Filer, File Returns
│       │   └── ui/
│       │       ├── CounterNumber.tsx   # Animated count-up number
│       │       ├── CurrencyInput.tsx   # Formatted salary input
│       │       ├── Select.tsx          # Accessible custom select
│       │       ├── Tooltip.tsx
│       │       └── SocialLink.tsx      # Icon + link with accessible label
│       ├── lib/
│       │   ├── tax-engine.ts           # Pure calculation functions (no React)
│       │   ├── country-detect.ts       # navigator.language → country resolve
│       │   ├── format.ts               # Currency formatting (Intl.NumberFormat)
│       │   ├── share-url.ts            # Build + parse shareable URL from calculator state
│       │   └── data-loader.ts          # Dynamic import of data/pakistan.json or data/india.json
│       ├── hooks/
│       │   ├── useCountry.ts
│       │   ├── useTaxData.ts           # Loads CountryData JSON and finds the right TaxYear
│       │   ├── useCalculatorUrl.ts     # Read/write calculator state to URL query params
│       │   └── useReducedMotion.ts
│       ├── public/
│       │   ├── .nojekyll
│       │   └── CNAME                  # tax.hubs.dpdns.org
│       └── next.config.js
├── packages/
│   └── schema/
│       └── src/
│           ├── tax-slab.ts             # TaxSlab, TaxRegime, TaxYear, CountryData Zod schemas
│           └── index.ts
├── etl/
│   └── src/
│       └── validate.ts                 # Validates data/pakistan.json + data/india.json against schema
├── data/
│   ├── pakistan.json                   # ALL fiscal years (2014-2015 → 2026-2027) in one CountryData object
│   ├── india.json                      # ALL fiscal years (2014-2015 → 2025-2026), both regimes from 2020-21
│   └── README.md                       # How to add a new fiscal year + validation command
├── .github/
│   └── workflows/
│       └── deploy.yml
├── pnpm-workspace.yaml
├── package.json
└── .prettierrc
```

---

## Phase 0 — Monorepo Scaffold & Tooling

- [x] Initialize git repo at project root; add `.gitignore` (node_modules, .next, out — **not** `data/`).
- [x] Create `pnpm-workspace.yaml` declaring `apps/*`, `packages/*`, `etl`.
- [x] Create root `package.json` with `"private": true`, `engines: { node: ">=20", pnpm: ">=9" }`, and workspace scripts: `dev`, `build`, `lint`, `validate`.
- [x] Create `packages/schema/` as a standalone package: `package.json`, `tsconfig.json` extending base.
- [x] Create `tsconfig.base.json` at root with strict options (§4 of instructions.md).
- [x] Install root dev dependencies: `typescript`, `prettier`, `eslint`, `@typescript-eslint/recommended`, `vitest`.
- [x] Configure `.prettierrc` (singleQuote, semi, tabWidth:2, printWidth:100).
- [x] Configure root `eslint.config.js`.
- [x] Add `apps/web/` Next.js project via `pnpm create next-app@latest --ts --tailwind --app --no-src-dir`.
- [x] Configure `apps/web/next.config.js`: `output: 'export'`, `images: { unoptimized: true }`, `basePath: ''`.
- [x] Create `apps/web/public/.nojekyll` (empty file).
- [x] Create `apps/web/public/CNAME` containing `tax.hubs.dpdns.org`.
- [x] Configure Tailwind in `apps/web` to use `darkMode: 'class'` and wire CSS token vars into `theme.extend`.
- [x] Add `etl/` package with `package.json` and `tsconfig.json`. Declare `packages/schema` as workspace dep.
- [x] Verify `pnpm install` resolves correctly with no cross-workspace leaks.

**Definition of done §0:** `pnpm -r build` exits 0 on a clean checkout with a "Hello World" Next.js page.

---

## Phase 1 — Zod Schema & Data Layer

### 1a — Zod schemas in `packages/schema`

- [x] Install `zod` as dep in `packages/schema`.
- [x] Define `TaxSlab` schema:
  ```ts
  z.object({
    min: z.number().nonnegative(),          // annual income lower bound (inclusive), in local currency
    max: z.number().positive().nullable(),  // null = no upper bound (top slab)
    rate: z.number().min(0).max(1),         // marginal rate as decimal (e.g. 0.20 for 20%)
    fixedAmount: z.number().nonnegative().default(0), // fixed tax on lower slabs before % kicks in
  })
  ```
- [x] Define `TaxRegime` schema:
  ```ts
  z.object({
    id: z.enum(['default', 'old', 'new']),
    label: z.string(),
    slabs: z.array(TaxSlab).min(1),
    standardDeduction: z.number().nonnegative().default(0),
    surcharge: z.array(z.object({
      threshold: z.number(),
      rate: z.number(),
    })).default([]),
    rebate87A: z.object({ maxIncome: z.number(), amount: z.number() }).nullable().default(null),
    cess: z.number().nonnegative().default(0), // 0.04 for India's 4% cess
    notes: z.string().optional(),
  })
  ```
- [x] Define `TaxYear` schema:
  ```ts
  z.object({
    country: z.enum(['PK', 'IN']),
    fiscalYear: z.string().regex(/^\d{4}-\d{4}$/),  // e.g. "2024-2025"
    currency: z.enum(['PKR', 'INR']),
    regimes: z.array(TaxRegime).min(1),
    defaultRegime: z.string(),  // matches a regime id in regimes[]
  })
  ```
- [x] Define `CountryData` schema — the top-level shape of each data file:
  ```ts
  z.object({
    country: z.enum(['PK', 'IN']),
    currency: z.enum(['PKR', 'INR']),
    currencySymbol: z.string(),           // "₨" or "₹"
    locale: z.string(),                   // "ur-PK" or "en-IN"
    years: z.array(TaxYear).min(1),       // newest-first order
  })
  ```
- [x] Export types via `z.infer<>`. Export `TaxSlab`, `TaxRegime`, `TaxYear`, `CountryData` from `packages/schema/src/index.ts`.
- [x] Write Vitest unit tests: valid record parses, invalid record throws.

### 1b — Pakistan tax data (`data/pakistan.json`)

Single file: `CountryData` object with `years` array (newest-first). All 13 fiscal years live here.

- [x] Create `data/pakistan.json` with top-level `{ country: "PK", currency: "PKR", currencySymbol: "₨", locale: "ur-PK", years: [...] }`.
- [x] `years[0]` = FY **2026-2027** — 8 slabs: 0%, 1%, 11%, 20%, 25%, 29%, 32%, 35%
  - Slabs (annual): 0–600K @ 0%, 600K–1.2M @ 1%, 1.2M–2.2M @ 11% (+6K fixed), 2.2M–3.2M @ 20% (+116K), 3.2M–4.1M @ 25% (+316K), 4.1M–5.6M @ 29% (+541K), 5.6M–7M @ 32% (+976K), >7M @ 35% (+1,424K)
- [x] `years[1]` = FY **2025-2026** — 6 slabs + 9% surcharge if income > 10M
  - Slabs: 0–600K @ 0%, 600K–1.2M @ 1%, 1.2M–2.2M @ 11% (+6K), 2.2M–3.2M @ 23% (+116K), 3.2M–4.1M @ 30% (+346K), >4.1M @ 35% (+616K)
- [x] `years[2]` = FY **2024-2025** — 6 slabs: 0%, 5%, 15%, 25%, 30%, 35%
- [x] `years[3]` = FY **2023-2024** — 6 slabs: 0%, 2.5%, 12.5%, 22.5%, 27.5%, 35%
- [x] `years[4]` = FY **2022-2023** — 7 slabs: 0%, 2.5%, 12.5%, 20%, 25%, 32.5%, 35%
- [x] `years[5]` = FY **2021-2022** — 10 fine-grained slabs (up to 75M)
- [x] `years[6]` = FY **2020-2021** — 10 slabs (same structure)
- [x] `years[7]` = FY **2019-2020** — 10 slabs
- [x] `years[8]` = FY **2018-2019** — 8 slabs (fixed-amount bottom slabs; model as `rate:0, fixedAmount:N`)
- [x] `years[9]` = FY **2017-2018** — 9 fine-grained slabs
- [x] `years[10]` = FY **2016-2017** — 9 slabs
- [x] `years[11]` = FY **2015-2016** — 9 slabs
- [x] `years[12]` = FY **2014-2015** — 9 slabs (oldest tracked)

### 1c — India tax data (`data/india.json`)

Single file: `CountryData` object with `years` array (newest-first). All 12 fiscal years live here.

- [x] Create `data/india.json` with top-level `{ country: "IN", currency: "INR", currencySymbol: "₹", locale: "en-IN", years: [...] }`.
- [x] `years[0]` = FY **2025-2026** — two regimes (new default + old)
  - New: 0–3L @ 0%, 3L–7L @ 5%, 7L–10L @ 10%, 10L–12L @ 15%, 12L–15L @ 20%, >15L @ 30%; stdDeduction: 75000; rebate87A: {maxIncome: 1200000, amount: 60000}; cess: 0.04
  - Old: 0–2.5L @ 0%, 2.5L–5L @ 5%, 5L–10L @ 20%, >10L @ 30%; stdDeduction: 50000; rebate87A: {maxIncome: 500000, amount: 12500}; cess: 0.04
- [x] `years[1]` = FY **2024-2025** — new + old (new: rebate 87A up to ₹7L)
- [x] `years[2]` = FY **2023-2024** — new (default from this year) + old
- [x] `years[3]` = FY **2022-2023** — old (default) + new optional
- [x] `years[4]` = FY **2021-2022** — old + new
- [x] `years[5]` = FY **2020-2021** — old + new (first year of new regime)
- [x] `years[6]` = FY **2019-2020** — old regime only
- [x] `years[7]` = FY **2018-2019** — old only; stdDeduction ₹40,000 reintroduced this year
- [x] `years[8]` = FY **2017-2018** — old only
- [x] `years[9]` = FY **2016-2017** — old only
- [x] `years[10]` = FY **2015-2016** — old only
- [x] `years[11]` = FY **2014-2015** — old only (oldest tracked)

### 1d — ETL validation script

- [x] In `etl/src/validate.ts`, load `data/pakistan.json` and `data/india.json`, parse each with `CountryData.safeParse()`, log errors with field path, exit 1 if any fail.
- [x] Also validate internal consistency: every `TaxYear.defaultRegime` must match an `id` in `regimes[]`; `years` array must be newest-first (each `fiscalYear` start year < previous).
- [x] Add `pnpm --filter etl run validate` to root `package.json` scripts.
- [x] Add a Vitest test in `etl/` that runs validation on a known-good and known-bad fixture.
- [x] Create `data/README.md` documenting: file structure, schema reference, how to add a new fiscal year (prepend to `years[]`), and `pnpm validate` command.

**Definition of done §1:** `pnpm validate` exits 0 on the two data files. Intentionally malformed entries produce a clear error with file + field path.

---

## Phase 2 — Tax Calculation Engine

All logic in `apps/web/lib/tax-engine.ts`. Pure functions only — no React, no side effects, fully unit-testable.

- [x] Implement `calculateTax(annualIncome: number, regime: TaxRegime): TaxCalculationResult`
  - Input: gross annual income (post any deductions already applied by caller), regime object.
  - Apply `regime.standardDeduction` if applicable: `taxableIncome = max(0, annualIncome - regime.standardDeduction)`.
  - Walk slabs in order, computing tax per band.
  - Apply `regime.rebate87A`: if `taxableIncome <= rebate87A.maxIncome`, subtract `min(tax, rebate87A.amount)`.
  - Apply `regime.surcharge` bands.
  - Apply `regime.cess` on (tax + surcharge).
  - Return: `{ taxableIncome, slabBreakdown: SlabTaxRow[], totalTax, effectiveRate, surcharge, cess }`.
- [x] `SlabTaxRow`: `{ slabLabel: string, slabMin: number, slabMax: number | null, rate: number, taxableAmountInSlab: number, taxInSlab: number, monthlyTaxInSlab: number }`.
- [x] Implement `monthlyFromAnnual(annualSalary: number): number` and inverse.
- [x] Implement `calculateFromMonthlySalary(monthlySalary: number, regime: TaxRegime): TaxCalculationResult` — converts monthly × 12, then delegates.
- [x] `TaxCalculationResult` must carry both monthly and annual versions of every output field: `{ annual: TaxFigures, monthly: TaxFigures, slabBreakdown, effectiveRate, surcharge, cess }` where `TaxFigures = { grossIncome, standardDeduction, taxableIncome, incomeTax, surcharge, cess, totalTax, takeHome }`.
- [x] For Pakistan FY2018-19 special shape (fixed minimum amounts), model as `fixedAmount` on the slab with `rate: 0` for the fixed-rate slabs.
- [x] Vitest unit tests:
  - [x] Pakistan 2026-27: salary 100K/month → verify exact tax.
  - [x] Pakistan 2026-27: salary 50K/month → verify falls in 0% bracket.
  - [x] India 2025-26 new regime: salary 1M/year → verify rebate 87A applies correctly.
  - [x] India 2025-26 new regime: salary 1.5M/year → verify cess calculation.
  - [x] India old regime: salary 500K/year → verify 87A rebate wipes tax.
  - [x] Edge cases: salary = 0, salary = exactly at slab boundary.

**Definition of done §2:** All tax engine unit tests pass. `pnpm -r test` exits 0.

---

## Phase 3 — Design System & App Shell

### 3a — CSS tokens & Tailwind config

- [x] Create `apps/web/app/globals.css` with all CSS custom properties from the Design System spec above (both `:root` light and `.dark` dark tokens).
- [x] Configure `tailwind.config.ts`:
  - `darkMode: 'class'`
  - `theme.extend.colors`: map all tokens to `var(--token-name)`.
  - `theme.extend.fontFamily`: `inter` and `jetbrains-mono`.
  - `theme.extend.borderRadius`: `card: '16px'`, `input: '12px'`.
- [x] Add fluid type scale utilities via `clamp()` in `theme.extend.fontSize`.

### 3b — Theme initialization (no FOUC)

- [x] In `apps/web/app/layout.tsx`, add an inline `<script>` in `<head>` (before any CSS) that:
  1. Reads `localStorage.getItem('tax.theme')`.
  2. Falls back to `window.matchMedia('(prefers-color-scheme: dark)').matches`.
  3. Adds `class="dark"` to `<html>` synchronously if dark.
- [x] The script must be `dangerouslySetInnerHTML` with a raw string (not a module) — it runs before React hydration.

### 3c — App Bar

- [x] `AppBar.tsx`: sticky, `backdrop-blur-md`, `bg-surface/80` (semi-transparent), border-bottom, 64px height desktop / 56px mobile.
- [x] Left: `TaxHubsLogo` SVG (geometric icon + wordmark "tax" in Inter bold).
- [x] Center: `TabNav` — horizontal pill-style tabs. Currently one tab: "Income Tax". Designed to accept future tabs via a `tabs` prop array.
- [x] Right: `CountryPicker` (flag emoji + country name dropdown) + `ThemeToggle` (sun/moon icon button, 44×44px).
- [x] On mobile (<768px): center the tab nav; move country + theme into a compact row below or in a slide-out drawer.
- [x] Collapse-on-scroll-down / reveal-on-scroll-up using `useScrollDirection` hook.

### 3d — Layout shell & Footer

- [x] `apps/web/app/layout.tsx`: mount `AppBar`, `<main>` with `pt-16` (offset for sticky bar), `<Footer />`.
- [x] `Footer.tsx` — three-column layout on desktop, stacked on mobile:
  - **Column 1 — Brand**: logo, tagline ("Your money. Your rights. Know them."), copyright.
  - **Column 2 — Links**: Income Tax, (future: GST, Capital Gains), data sources (FBR, Income Tax India), disclaimer.
  - **Column 3 — Social**: icon links with accessible labels:
    - Twitter / X — `aria-label="Follow on X"`
    - LinkedIn — `aria-label="Connect on LinkedIn"`
    - GitHub — `aria-label="View source on GitHub"` (links to the repo)
    - WhatsApp share link (pre-filled: "Check out this tax calculator: <url>")
  - Bottom strip: "Data sourced from FBR (Pakistan) and Income Tax Act (India). Updated annually. Not financial advice."
- [x] Social icon components: use simple inline SVG icons (no icon library dep). Each is a `SocialLink.tsx` with `href`, `icon`, `label`.
- [x] Loading state: skeleton shimmer using `bg-surface-muted animate-pulse` (no external library).

**Definition of done §3:** App shell renders in both light and dark modes with no theme flash. AppBar is responsive. TabNav renders "Income Tax" tab as active. Footer shows all social links with correct accessible labels.

---

## Phase 4 — Income Tax Calculator UI

### 4a — Hero Banner (`HeroBanner.tsx`)

Full-width banner at the top of the `/income-tax` page, above the calculator form.

- [~] Background: animated gradient mesh — greens, dark teals, and a gold accent. Animation is a slow 8s morphing keyframe (`@keyframes gradient-shift`). Gated on `prefers-reduced-motion`.
- [~] Headline (rotating slogans — cycles every 4s with a fade transition, pauses on hover):
  - "Know Your Numbers. Keep More of What You Earn."
  - "Taxes Don't Have to Be Taxing."
  - "Transparent. Accurate. Instant."
  - "From Karachi to Mumbai — Your Tax, Your Way."
- [x] Sub-headline: "Free income tax calculator for Pakistan & India. Instant breakdown by slab, monthly and yearly."
- [~] Animated stat chips (count-up on load): "13 years of Pakistan data · 12 years of India data · 2 countries · 100% free"
- [ ] Two CTA buttons in the hero:
  - Primary: "Calculate My Tax →" (smooth-scrolls to the form below)
  - Secondary: "Get Help Filing" (anchor links to `#consultant-cta` section)
- [ ] Mobile: full-width, reduced padding, single-column, slogans shortened.
- [x] `aria-live="polite"` on the rotating slogan region with `aria-atomic="true"`.

### 4b — Calculator form (`CalculatorForm.tsx`)

- [~] Salary input (`CurrencyInput.tsx`):
  - Numeric input, formatted with `Intl.NumberFormat` on blur.
  - Label: "Monthly Salary" with currency symbol prefix (₨ / ₹).
  - Placeholder: e.g. "Enter your monthly salary".
  - Keyboard: `inputmode="decimal"`.
  - Large, prominent — 56px height, full-width on mobile.
- [x] Fiscal year select (`Select.tsx`):
  - Lists available years for the selected country in reverse-chronological order.
  - Default: most recent year.
  - Accessible: keyboard-navigable, ARIA labels.
- [x] Country select (also in `AppBar` — but mirrored in form for discoverability):
  - Flag emoji + country name: 🇵🇰 Pakistan · 🇮🇳 India.
- [x] For India: `RegimeToggle.tsx` appears below the form when the selected year has dual regimes.
  - Pill toggle: "New Regime" | "Old Regime".
  - Default: `defaultRegime` from the JSON.
  - Hidden for years with only one regime, or for Pakistan (always).
- [ ] Validation: show inline error if salary is 0 or non-numeric. No API calls.
- [x] Auto-calculate on every input change (no submit button needed — real-time feedback).
- [ ] `ShareButton.tsx` appears inside the form card once a salary is entered:
  - Icon: chain-link SVG + label "Share this calculation".
  - On click: writes the shareable URL (see §4g) to clipboard, shows a "Copied!" toast for 2s.
  - On mobile: uses `navigator.share()` (Web Share API) if available; falls back to clipboard copy.
  - The URL encodes: `?country=PK&year=2026-2027&salary=150000&view=monthly`.

### 4c — Monthly/Yearly toggle (`ViewToggle.tsx`)

- [x] Pill toggle rendered between the form and results: **Monthly** | **Yearly**.
- [ ] Default: Monthly. Persisted to `localStorage` as `tax.view` and to URL as `&view=monthly`.
- [ ] When toggled, all result figures (summary cards, slab table, bar chart) switch simultaneously with a cross-fade animation (gated on motion).
- [x] Label above toggle: "View results as:".

### 4d — Result summary panel (`ResultSummary.tsx`)

Shows a card grid. Cards display figures for the selected view (monthly or yearly). All values are derived from the calculation result's `monthly` or `annual` fields:

- [x] **Gross Income** — total salary (monthly or yearly). Shown as context/reference.
- [x] **Taxable Income** — after standard deduction. With tooltip explaining the deduction.
- [x] **Income Tax** — base tax before cess/surcharge.
- [ ] **Surcharge** — shown as a separate card only if non-zero (India high earners, Pakistan FY2025-26 >10M).
- [ ] **Cess / Levy** — shown as a separate card only if non-zero (India: 4%).
- [x] **Total Tax** — income tax + surcharge + cess. Prominently styled, largest font.
- [x] **Take-Home Pay** — gross minus total tax. Shown in green.
- [x] **Effective Tax Rate** — `totalTax / grossIncome` as %. Large pill badge with color scale:
  - 0–5%: green · 5–15%: amber · 15–25%: orange · >25%: red.
- [ ] **Tax-Free Threshold** notice: inline callout if income ≤ threshold for the year.
- [~] All numbers: `CounterNumber` animation on change. Formatted with `Intl.NumberFormat` for the country locale.
- [ ] Cards expand/collapse on mobile with a smooth chevron toggle (summary view vs. full breakdown).

### 4e — Slab breakdown table (`SlabBreakdown.tsx`)

- [x] Section heading: "Tax Breakdown by Slab".
- [x] Columns (adapt labels based on monthly/yearly toggle):
  - Slab Range (income bracket)
  - Taxable Amount in Slab (monthly | yearly — controlled by toggle)
  - Rate (%)
  - Tax on This Slab (monthly | yearly)
  - % of Total Tax (sparkline mini-bar)
- [x] All figures update simultaneously when the monthly/yearly toggle changes — no re-render flicker.
- [~] Highlight the **active slab** (the one the user's income falls in) with `bg-accent-soft`, a green left border, and a small "← you are here" chip.
- [x] Slabs the user doesn't reach are rendered at `opacity-40` and crossed out.
- [ ] Staggered row entrance animation: each row slides in from left with 30ms delay (gated on motion).
- [~] Mobile: horizontally scrollable table. Stick the first column (Slab Range).
- [x] Footer rows below the table:
  - Standard Deduction (if applicable)
  - Income Tax subtotal
  - Surcharge (if non-zero)
  - Cess (if non-zero)
  - **Total Tax** (bold, accent color)
  - Take-Home Pay (green)

### 4f — Slab bar chart (`SlabBarChart.tsx`)

- [x] Horizontal stacked bar chart visualizing each slab's tax contribution to the total.
- [x] Each segment width = `(taxInSlab / totalTax) * 100%`, animated from 0 on mount/update.
- [x] Color gradient: lightest green for the lowest slab → darkest green for the top slab.
- [x] Tooltip on hover/tap: shows slab label, exact monthly and yearly amounts, and percentage of total.
- [x] Below the chart: a legend row mapping each color to its slab range.
- [~] Responsive: full-width. On mobile, switch to a vertical bar chart (bars top-to-bottom).
- [x] Accessible: `role="img"`, `aria-label` with a text summary ("Your tax is spread across N slabs…").

### 4g — India dual-regime comparison (when applicable)

- [x] When the year has both old and new regimes, render a **"Which regime saves you more?"** comparison panel:
  - Two side-by-side cards (stacked on mobile): Old Regime | New Regime.
  - Each card: total annual tax, effective rate, take-home monthly.
  - The card with lower tax gets a green "You save ₹X/year" badge. The other gets a red "₹X more tax" badge.
  - A chevron separator between the two cards animates left/right to point at the winner.
- [x] This panel appears below the main slab breakdown.

### 4h — Year-over-year comparison (`YearComparison.tsx`)

- [x] Small callout card below the main results: "vs. Previous Year".
- [x] Shows: last year's tax for the same salary, the delta (+/- amount, monthly and yearly), and effective rate change.
- [x] Color-coded: green if tax decreased, red if increased.
- [ ] Up/down animated arrow indicator.
- [x] Only rendered when the prior year's data exists in the `years` array.

### 4i — Shareable URL (`ShareButton.tsx` + `useCalculatorUrl.ts`)

- [x] `share-url.ts` (lib): `buildShareUrl(state: CalcState): string` — returns absolute URL with query params `country`, `year`, `salary`, `view`, optionally `regime` (India).
- [x] `parseShareUrl(searchParams: URLSearchParams): Partial<CalcState>` — reads params back into state. Validates types; ignores unknown/malformed params.
- [x] `useCalculatorUrl.ts` hook:
  - On mount: read `?country`, `?year`, `?salary`, `?view`, `?regime` from URL. If present, use as initial state (overrides localStorage defaults).
  - On state change: call `router.replace(buildShareUrl(state), { scroll: false })` debounced 300ms.
- [x] `ShareButton.tsx`:
  - [x] Rendered in the results section, visible only after salary > 0.
  - [x] Icon: chain/link SVG. Label: "Share" on desktop, icon-only (with `aria-label`) on mobile.
  - [x] Click: `navigator.share({ title, url })` if supported; else `navigator.clipboard.writeText(url)`.
  - [x] Shows a "Copied!" or "Shared!" toast overlay for 2 seconds (CSS keyframe fade, no library).
  - [x] Social quick-share row below the main button:
    - WhatsApp: `https://wa.me/?text=Check+my+tax+calculation+%3A+<url>`
    - Twitter/X: `https://x.com/intent/tweet?text=...&url=<url>`
    - LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=<url>`
  - [x] All open in `target="_blank" rel="noopener noreferrer"`.

### 4j — Tax consultant CTAs (`ConsultantCTA.tsx`)

Render a CTA section with `id="consultant-cta"` below the calculator and breakdown. The hero banner's "Get Help Filing" button anchor-links here.

- [x] Section heading: "Need Professional Help?"
- [x] Three CTA cards side-by-side on desktop, stacked on mobile:
  1. **"Contact a Tax Agent"** — icon: person/briefcase. Description: "Speak to a certified tax consultant for personalized advice." Button: "Find an Agent →" (primary green, external link placeholder `href="#"`).
  2. **"Become a Tax Filer"** — icon: document-check. Description: "Filing your returns keeps you compliant and unlocks benefits. We'll show you how." Button: "Start Filing →" (outline style).
  3. **"We'll File For You"** — icon: shield-check. Description: "Let our partner consultants handle your entire tax return from start to finish." Button: "Get Started →" (primary green).
- [x] Cards have a subtle hover lift (`translateY(-4px)`, shadow deepens) gated on motion.
- [x] All external links: `target="_blank" rel="noopener noreferrer"`.
- [x] Links are `href="#"` placeholders at build time — documented in `data/README.md` as config values to update when a consultant partner is onboarded.
- [x] On mobile, the three cards scroll horizontally (snap scroll container) instead of stacking, to keep them above the fold.
- [x] Add a fourth card below the row: **"Disclaimer"** — small, muted style. "This calculator provides estimates only. Consult a qualified tax professional for advice specific to your situation."

**Definition of done §4:** User can enter a salary, select country and fiscal year, and immediately see correct tax breakdown with animations. Monthly/yearly toggle works. India dual-regime comparison renders correctly. Share URL round-trips (copy URL → paste in new tab → form pre-filled). CTA section is visible below the breakdown.

---

## Phase 5 — Geo-detection & Country Persistence

- [x] `country-detect.ts`: exports `detectCountry(): 'PK' | 'IN' | null`.
  - Reads `navigator.language` (e.g. `ur-PK`, `pa-PK`, `en-PK` → PK; `hi-IN`, `en-IN`, `ta-IN` → IN).
  - Returns `null` if unresolvable.
- [x] `useCountry.ts` hook:
  1. On mount: read `localStorage.getItem('tax.country')` → if set, use it.
  2. Else: call `detectCountry()` → if resolved, store to `localStorage`, use it.
  3. Else: default to `'PK'`.
  4. Exports `[country, setCountry]` — `setCountry` writes to `localStorage`.
- [x] `CountryPicker` in AppBar calls `setCountry` on change; preference persists on reload.
- [x] Mirror the country picker in the `CalculatorForm` — both are controlled by the same state (via context or passed props).
- [x] Static shell always renders Pakistan — no SSR mismatch.
- [x] URL param `?country=IN` overrides locale detection and localStorage (shared link takes priority).

**Definition of done §5:** Visiting from a Pakistani locale defaults to Pakistan; Indian locale defaults to India. Manual override persists across page refreshes. A shared URL with `?country=IN` opens with India selected regardless of visitor locale.

---

## Phase 6 — SEO, Accessibility & Performance

### 6a — SEO

- [x] `apps/web/app/layout.tsx` root `generateMetadata`: title `"Tax Calculator — Income Tax, Pakistan & India"`, description, OG image (a green-themed preview card).
- [x] `apps/web/app/income-tax/page.tsx` `generateMetadata`: page-specific title `"Income Tax Calculator 2025-26 — Pakistan & India | tax.hubs.dpdns.org"`.
- [x] `apps/web/app/sitemap.ts`: includes `/`, `/income-tax`. Future tax type routes added here.
- [x] Canonical URL set to `https://tax.hubs.dpdns.org`.
- [x] Structured data (`application/ld+json`): `WebApplication` schema with `applicationCategory: "FinanceApplication"`.
- [x] OG image: static `public/og-image.png` (1200×630). Green gradient background, white headline "Income Tax Calculator — Pakistan & India", sub-text "Free · Instant · By Slab", flag emojis 🇵🇰 🇮🇳. Author once as a PNG asset (no runtime generation needed).

### 6b — Accessibility

- [x] Audit: every interactive element has visible focus ring (2px solid `--accent`, `outline-offset: 2px`).
- [ ] Color contrast audit: run all text/background combinations through contrast checker — WCAG AA minimum.
- [x] Keyboard: Tab navigates form → select → result; `/` focuses salary input.
- [x] Screen reader: `aria-live="polite"` region wrapping `ResultSummary` so results are announced on change. Separate `aria-live` on the rotating hero slogan.
- [x] `<main>` landmark, `<h1>` = "Income Tax Calculator", logical heading hierarchy.
- [x] All touch targets ≥ 44×44px.
- [ ] Test with keyboard-only navigation.

### 6c — Performance

- [x] Tax data loaded via dynamic import (`import()`) — not bundled into initial JS. `data/pakistan.json` and `data/india.json` are loaded lazily when the country is selected (or on first interaction). Since each file contains all years, only one fetch per session per country.
- [ ] Total initial JS bundle target: < 100KB gzipped.
- [x] `next/font` self-hosts Inter and JetBrains Mono — zero external font requests.
- [x] Images: none required for core calculator. Any decorative SVG is inlined.
- [ ] Lighthouse score targets: Performance ≥ 95, Accessibility ≥ 98, Best Practices ≥ 100, SEO ≥ 100.

**Definition of done §6:** Lighthouse CI passes targets. Axe accessibility scan reports 0 violations. All pages render meaningful HTML without JavaScript.

---

## Phase 7 — CI/CD & Deployment

### 7a — GitHub Actions deploy workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
    paths: ['data/**', 'apps/web/**', 'packages/**']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter etl run validate     # fail fast if data is corrupt
      - uses: actions/cache@v4
        with:
          path: apps/web/.next/cache
          key: nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-${{ github.sha }}
          restore-keys: nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-
      - run: pnpm --filter web run build
      - run: touch apps/web/out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with: { path: apps/web/out }
      - id: deploy
        uses: actions/deploy-pages@v4
```

- [x] Create the deploy workflow file as above.
- [ ] Confirm GitHub Pages is configured for the repo: source = "GitHub Actions" (not branch).
- [ ] Confirm custom domain `tax.hubs.dpdns.org` is set in repo Pages settings (CNAME file handles it on deploy).
- [x] Add `pnpm -r lint` step before build.
- [x] Add `pnpm -r test` step before build.

### 7b — Data update workflow (manual process, no automation needed)

Since tax slabs change once per year:
- [x] Document in `data/README.md`: how to add a new fiscal year JSON, schema reference, validation command.
- [x] The workflow: author new JSON → run `pnpm validate` locally → commit to main → CI auto-deploys.

**Definition of done §7:** Pushing to main triggers deploy. Site is live at `https://tax.hubs.dpdns.org/income-tax` within 3 minutes of merge. HTTPS works. No `_next/` 404s.

---

## Phase 8 — Mobile & Responsive Polish

- [x] Test at 320px, 375px, 768px, 1024px, 1280px, 1536px viewports.
- [x] Portrait mobile (375×812): single-column layout, full-width inputs, stacked result cards, scrollable slab table.
- [x] Landscape mobile (812×375): 2-column form + result side-by-side if space allows.
- [x] Tablet (768px): 2-column result grid, full slab table.
- [x] Desktop (1280px+): max-width centered calculator panel, result cards in row.
- [x] Touch: swipe gestures on regime toggle (India).
- [x] Verify no horizontal overflow at any viewport.
- [x] Test font scale with browser zoom at 200%.

**Definition of done §8:** No layout breakage from 320px to 2560px. Passes Chrome DevTools responsive tests for major device presets.

---

## Open Questions

- [x] **OG image**: Resolved — static `public/og-image.png` (1200×630). Author once; no runtime generation.
- [ ] **India surcharge**: Progressive surcharge for high earners (10%/15%/25%/37% on income > 50L/1Cr/2Cr/5Cr) adds complexity. Include surcharge slabs in the `TaxRegime` schema (already modeled) and implement in tax engine. Data must be authored for affected years.
- [ ] **Pakistan 2018-19 fixed-amount slabs**: The 800K–1.2M slab is "Rs. 2,000" flat (no percentage). Modeled as `rate: 0, fixedAmount: 2000` — verify the engine handles this in the unit test for that year.
- [ ] **Currency input max**: Cap at 100M for both countries; show a warning above that threshold.
- [x] **Consultant partner links**: CTA buttons use config placeholders in a single source. When a partner is onboarded, update the three link values in `apps/web/lib/site-config.ts` (documented in `data/README.md`).
- [ ] **WhatsApp share on desktop**: `wa.me` links open WhatsApp Web on desktop — acceptable UX. No change needed.
- [x] **Hero slogan rotation**: Keep JS interval rotation (single visible slogan) with `prefers-reduced-motion` guard. Slogans are now country-agnostic for future expansion.
- [ ] **Single JSON file size**: `pakistan.json` will be ~25KB, `india.json` ~20KB uncompressed. Both compress well (gzip ~5KB each). Acceptable for dynamic import — no chunking needed.

---

## Immediate Next Steps

1. **`[ ]` Init monorepo** — run `pnpm init`, create `pnpm-workspace.yaml`, install root devDeps.
2. **`[ ]` Scaffold Next.js app** — `pnpm create next-app@latest apps/web --ts --tailwind --app`.
3. **`[ ]` Write `packages/schema/src/tax-slab.ts`** — define and export all four Zod schemas (`TaxSlab`, `TaxRegime`, `TaxYear`, `CountryData`).
4. **`[ ]` Author `data/pakistan.json`** — full single-file CountryData with all 13 years; start with 2026-2027 at `years[0]`, oldest at `years[12]`.
5. **`[ ]` Author `data/india.json`** — full single-file CountryData with all 12 years; dual-regime entries for FY 2020-21 onward.
6. **`[ ]` Write `etl/src/validate.ts`** — parse both files with `CountryData.safeParse()`, validate internal consistency, exit-code 1 on failure.
7. **`[ ]` Implement `tax-engine.ts` + Vitest tests** — lock down calculation logic (including monthly/yearly output, surcharge, cess, rebate87A) before building any UI.

Once these 7 steps are done, the foundation is solid and UI work (Phase 3+) can proceed without rework.
