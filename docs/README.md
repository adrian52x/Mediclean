# Mediclean / Dezinfect MD — Internal Documentation

This folder is the working documentation for the app. It exists so that anyone (a human returning after a break, or an AI assistant starting a new task) can get up to speed quickly without re-reading the whole codebase.

Each file documents one **decoupled** part of the app. Read the one relevant to your task rather than everything.

## Index

| File | What it covers |
|------|----------------|
| [architecture.md](./architecture.md) | High-level overview: stack, folder layout, how the pieces fit together. **Start here.** |
| [data-model.md](./data-model.md) | The real database schema (Supabase), tables, relationships. **No ORM — read the note here.** |
| [data-layer.md](./data-layer.md) | How data is read/written: API classes, TanStack Query hooks, the Supabase clients. |
| [products.md](./products.md) | Product catalog: listing, filtering, search, product detail page, image/volume-price model. |
| [cart-and-checkout.md](./cart-and-checkout.md) | Cart (Zustand store) and the checkout + order flow. |
| [auth-and-admin.md](./auth-and-admin.md) | Authentication, route protection, the admin panel, and how admin access is gated. |
| [email.md](./email.md) | Email verification codes + order-confirmation emails (Resend + Supabase). |
| [seo.md](./seo.md) | SEO architecture: metadata, structured data, sitemap, analytics. |
| [routing.md](./routing.md) | Next.js App Router structure, route groups, and what each route renders. |
| [conventions.md](./conventions.md) | Code conventions, patterns, gotchas, and things that will surprise you. |
| [environment.md](./environment.md) | Environment variables and local setup. |

## The 30-second summary

**Dezinfect MD** is a Next.js 15 e-commerce storefront for a Moldovan company selling medical disinfectants and equipment. Customers browse products, filter/search, add to a cart, and place an order (which is currently emailed to the business — orders are **not** yet stored in a database). There is an **admin panel** (email-gated) to manage products. The UI language is **Romanian**. Data lives in **Supabase** (Postgres + Storage + Auth).

## Biggest thing to know before you touch anything

**There is no ORM.** The app talks to Supabase directly via `@supabase/supabase-js`. There's no schema file in the repo — the database schema lives in Supabase, and the app-facing shapes are hand-maintained in `types.ts`. (Prisma was an early experiment and has been fully removed.) Trust `types.ts` and the `lib/api/*` queries. See [data-model.md](./data-model.md).
