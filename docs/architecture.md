# Architecture Overview

## What the app is

**Dezinfect MD** (project codename `mediclean`) is an online store for medical **disinfectants** and **equipment**, targeted at the Moldovan market (medical clinics, dental practices, hospitals). The site is in **Romanian**.

Core user journeys:
- **Visitor**: browse products → filter/search → view a product → add to cart → checkout (verify email → submit order → business receives an email).
- **Admin**: log in → manage products (create, update, delete, images, volume-based pricing).

## Tech stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, React 19, Turbopack in dev) |
| Language | TypeScript (strict) |
| Database | **Supabase** (PostgreSQL) |
| File storage | **Supabase Storage** (buckets: `product-images`, `product-pdfs`, `services-images`) |
| Auth | **Supabase Auth** (used only for admin login) |
| Server data fetching | `@supabase/ssr` (server client + middleware) |
| Client data fetching / caching | **TanStack Query** (`@tanstack/react-query`) |
| Client state (cart) | **Zustand** (with `persist` to localStorage) |
| UI components | **shadcn/ui** (Radix primitives) + some **daisyUI** + Tailwind CSS v4 |
| Icons | `lucide-react`, `react-icons` |
| Email | **Resend** (transactional email) |
| Toasts | `sonner` |
| Carousel | `embla-carousel` |
| Nav progress bar | `nprogress` |
| Theming | `next-themes` (light/dark, system default) |
| ORM | **None.** Data access is the Supabase SDK directly (see note below) |

## No ORM — Supabase SDK directly

There is no ORM and no schema file in the repo. **All data access goes through the Supabase JS client** (`lib/api/*` and `lib/supabase/*`), which talks to PostgREST over your Postgres. The database schema lives in Supabase; the app-facing types are hand-maintained in `types.ts` (with generated DB types in `types_db.ts`).

Prisma was an early experiment and has been **fully removed** (package, schema, migrations, generated client). The authoritative schema is documented in [data-model.md](./data-model.md), reconstructed from `types.ts` and the actual Supabase queries.

## Folder layout

```
mediclean/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fonts, providers, SEO, analytics
│   ├── globals.css               # Tailwind + theme tokens
│   ├── loading.tsx               # Global loading UI
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── (mediclean)/              # Route group for the storefront + admin
│   │   ├── (routes)/             # Public storefront (has its own layout w/ navbar+footer)
│   │   │   ├── page.tsx          # Home
│   │   │   ├── products/         # Product list + [id] detail
│   │   │   └── checkout/         # Checkout
│   │   └── (protected)/          # Admin area (guarded by middleware)
│   │       └── admin/
│   ├── auth/                     # Login page + Supabase auth callback
│   └── api/                      # Route handlers (email verification, order email)
│
├── components/                   # React components (grouped by feature)
│   ├── ui/                       # shadcn/ui primitives (button, card, dialog, ...)
│   ├── navbar/  footer/ ...      # Layout chrome
│   ├── product/                  # Product cards, grids, filters, detail views
│   ├── admin/                    # Admin forms, tables, uploaders
│   ├── checkout/                 # Checkout form
│   ├── SEO/                      # Structured data, analytics, SEO content blocks
│   └── bin/                      # Dead/experimental code — ignore
│
├── lib/
│   ├── api/                      # Data-access classes (ProductsAPI, ImagesAPI, ...)
│   ├── hooks/                    # TanStack Query hooks + UI hooks
│   ├── services/                 # Server-side singletons (email services)
│   ├── stores/                   # Zustand stores (cartStore)
│   ├── supabase/                 # Supabase client factories (browser/server/middleware)
│   ├── seo/                      # SEO config + structured-data generators
│   ├── utils/                    # Text formatting helpers
│   └── utils.ts                  # cn(), product filtering, validation, order ID gen
│
├── providers/                    # React context providers (TanStack Query, theme)
├── public/                       # Static assets (images, svgs, partners, robots.txt)
├── middleware.ts                 # Route protection (delegates to lib/supabase/middleware)
├── types.ts                      # App-wide domain types (source of truth for data shapes)
├── types_db.ts                   # Generated Supabase DB types
└── next.config.ts                # Image optimization config (Supabase remote patterns)
```

## Request/rendering model

- **Server Components by default.** Pages like the home page and product list/detail pages are server components; the interactive parts (`'use client'`) are pushed down into leaf components (forms, filters, cart buttons).
- **Middleware runs on every non-static request** (`middleware.ts` → `lib/supabase/middleware.ts`). It refreshes the Supabase session and enforces route protection (notably, `/admin`).
- **Client data fetching** happens in client components via TanStack Query hooks (`lib/hooks/useProducts.ts`, etc.), which call the `lib/api/*` classes, which use the **browser** Supabase client.

## How the layers connect (products example)

```
Page (server component)
   └─ Client component ('use client')
        └─ TanStack Query hook (lib/hooks/useProducts.ts)
             └─ API class (lib/api/ProductsAPI.ts)
                  └─ Supabase browser client (lib/supabase/browser.ts)
                       └─ Supabase Postgres / Storage
```

For email flows, the client goes through an API route instead:

```
Client component
   └─ EmailAPI (lib/api/EmailAPI.ts)  →  fetch('/api/...')
        └─ Route handler (app/api/.../route.ts)
             └─ Service singleton (lib/services/*)  →  Resend / Supabase (service role)
```

See [data-layer.md](./data-layer.md) and [email.md](./email.md) for details.

## What is NOT built yet

Per `todo.md` and the code:
- **Orders are not persisted.** Checkout emails the order; nothing is written to the DB.
- No customer accounts (auth is admin-only).
- No privacy policy / terms / GDPR pages.
- Admin "orphan image" cleanup is planned, not built.
