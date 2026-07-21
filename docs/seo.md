# SEO

SEO is deliberately centralized so pages stay thin. There's an older, celebratory checklist at the repo root (`SEO_CHECKLIST.md`) — this file is the practical map.

## The central hub — `lib/seo/structured-data.ts`

Everything SEO-related lives here:
- **`SITE_CONFIG`** — business identity: name (`Dezinfect MD`), URL (`https://www.dezinfect.md`), logo, address (Str. Nicolae Zelinski 36/6, Chișinău), phone, email. **Change business details here once.**
- **`PRODUCT_CATEGORIES`** — per-category (`disinfectants`, `equipment`) titles, descriptions, and keyword sets.
- **`BASE_KEYWORDS`** — keywords applied broadly.
- **Generators:**
  - `generateProductsMetadata(category?)` → Next `Metadata` for the products page (title, description, keywords, OG, Twitter, canonical, robots). Category-aware.
  - `generateProductsSchema(category?)` → JSON-LD `CollectionPage` with an `ItemList`.
  - `generateLocalBusinessSchema()` → JSON-LD `LocalBusiness` (address, hours Mon–Fri 09:00–18:00, currency MDL).
  - `generateWebsiteSchema()` → JSON-LD `WebSite` with site-nav elements.
  - `generateOrganizationSchema()` → JSON-LD `Organization` with contact point (Romanian + Russian).

## Injection

- **Structured data (JSON-LD):** `components/SEO/StructuredData.tsx` renders a `<script type="application/ld+json">`. The root layout injects LocalBusiness + Website + Organization schemas in `<head>`. The products page injects the CollectionPage schema.
- **Metadata:** exported from page `metadata` objects or `generateMetadata()` functions. Root defaults in `app/layout.tsx`; per-page overrides in the page files.
- **Sitemap:** `app/sitemap.ts` generates `/sitemap.xml`.
- **robots:** `public/robots.txt`.
- **Analytics:** `components/SEO/GoogleAnalytics.tsx`, mounted in the root layout with `GA_MEASUREMENT_ID="G-H8BQVBM821"`.

## SEO content blocks

`components/SEO/` also has content components (`SEOContent.tsx`, `AboutSEOContent.tsx`) with keyword-rich copy for landing sections. Some are currently commented out in the home page (`HomePageSEOContent`).

## Language & locale

The site is Romanian (`<html lang="ro">`, `locale: 'ro_MD'`). Keep user-facing copy and SEO text in Romanian.

## Adding SEO for a new page

1. Add a config entry (title/description/keywords) to `structured-data.ts` — follow the `PRODUCT_CATEGORIES` / `PAGE_CONFIGS` pattern.
2. Add a generator or reuse `generateProductsMetadata`-style helpers.
3. In the page, export `metadata` (static) or `generateMetadata()` (dynamic).
4. If the page benefits from structured data, add a generator and inject `<StructuredData data={...} />`.
5. Add the URL to `app/sitemap.ts`.
