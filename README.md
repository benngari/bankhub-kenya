# BankHub Kenya

A directory of CBK-licensed banks in Kenya — instant fuzzy search, bank profiles, branch
directory, side-by-side comparison, financial calculators, exchange rates, and banking news.

Built with React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui-style components on Radix
primitives, Framer Motion, React Router, TanStack Query, Zustand, Fuse.js, React Hook Form + Zod.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    ui/          shadcn-style primitives (button, card, input, tabs, dialog, select, ...)
    layout/       Header, Footer
    shared/       BankCard, BankLogo, BranchList, SearchCommand, PageLoader
  pages/          One file per route (lazy-loaded, code-split)
  hooks/          TanStack Query hooks + Fuse.js fuzzy-search hooks
  store/          Zustand store (favorites, recently viewed, search history, theme, compare tray)
  services/       bankService.ts — the only place that touches the data source
  data/           banks.json, branches.json, news.json, exchangeRates.json
  types/          Shared TypeScript types for the domain model
  constants/      Routes, categories, counties, popular searches
  lib/             utils.ts (cn, formatters, debounce)
```

## Search

`useFuzzySearch` (in `src/hooks/useFuzzySearch.ts`) wraps Fuse.js with weighted keys across
bank name, short name, acronym, bank code, SWIFT code, products, category, and headquarters —
so a query like "Co-op", "EQ", or a slightly misspelled name still resolves. The header's
command palette (press `/`) and the `/search` page both use it; the branch directory has its
own instance searching branch name / town / county.

## Data & connecting a real backend later

All data currently lives in static JSON under `src/data/` and is served through
`src/services/bankService.ts`, which returns Promises shaped like real API calls (including
simulated latency). To connect Supabase, Firebase, or a REST API:

1. Replace the function bodies in `bankService.ts` with real calls (e.g. `supabase.from('banks').select()`).
2. Keep the same return shapes (`Bank[]`, `Branch[]`, etc. from `src/types/bank.ts`).
3. No component code needs to change — everything consumes the service through the
   `useBanks.ts` TanStack Query hooks.

## What's included vs. what's scaffolded for you to extend

**Fully implemented:** fuzzy/typo-tolerant search with autocomplete and keyboard navigation,
20 sample banks across all 5 categories with realistic (placeholder) branch, contact, rates,
and digital-services data, bank profile pages (overview / contact / banking info / digital
services / products / branches), branch directory with county filtering, side-by-side compare
(up to 4 banks), 6 financial calculators, exchange rates + currency converter, banking news
with category filters, favorites, recently viewed, search history, dark mode, notifications,
copy SWIFT/bank code, share, print, and a downloadable text profile — all persisted to
`localStorage` via Zustand.

**Intentionally left for you to extend:** the "Download PDF profile" action currently exports
a plain-text file rather than a styled PDF (wire up a library like `@react-pdf/renderer` if you
want a branded PDF); branch coordinates are randomly generated placeholders rather than real
geocoded addresses; CEO names, license numbers, and contact details are realistic-looking
placeholders, not verified real-world data — replace `src/data/*.json` with verified data before
using this for anything beyond a demo/portfolio piece.

## Notes on realism of the data

Bank names, SWIFT-code formats, categories, and general product line-ups reflect Kenya's actual
banking sector, but individual figures (branch counts, CEO names, exact rates, license numbers)
are generated placeholders for demonstration — see `src/data/banks.json` and the generator
comments for exactly what's synthetic.
