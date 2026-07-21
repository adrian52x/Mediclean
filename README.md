# Dezinfect MD

Online store for professional medical **disinfectants** and **equipment**, serving the Moldovan market (clinics, dental practices, hospitals). Live at **[dezinfect.md](https://www.dezinfect.md)**.

> Project codename: `mediclean`. UI language: Romanian.

## Features

- 🛍️ **Product catalog** with category, product-type, and medical-field filtering + real-time search
- 💧 **Volume-based pricing** for disinfectants (e.g. 100ml / 500ml / 1L, each priced separately)
- 🛒 **Cart & checkout** with email verification before order placement
- 📧 **Order confirmation emails** to customers and the business
- 🔐 **Admin panel** for managing products, images, and pricing
- 🌗 **Light/dark theme**, responsive design
- 🔎 **SEO-optimized** — dynamic metadata, JSON-LD structured data, sitemap

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL, Storage, Auth) |
| Data fetching | TanStack Query |
| State | Zustand |
| UI | Tailwind CSS v4, shadcn/ui (Radix), daisyUI |
| Email | Resend |
| Hosting | Vercel |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
#    Create .env and .env.local (see docs/environment.md for the full list)

# 3. Run the dev server
npm run dev          # http://localhost:3000
```

You'll need a **Supabase** project (Postgres + Storage + Auth with Google OAuth) and a **Resend** account. See **[docs/environment.md](./docs/environment.md)** for the complete setup and environment variables.

## Scripts

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
npm run format   # prettier
```

## Project structure (high level)

```
app/          Next.js routes (storefront, admin, API routes)
components/   UI components (product, admin, checkout, navbar, ui/…)
lib/          Data access (api/, hooks/), services, stores, supabase clients, seo, utils
docs/         Detailed internal documentation
```

> Data access is via the Supabase JavaScript SDK directly — there is no ORM.

## Documentation

Detailed docs live in **[`docs/`](./docs/README.md)** — architecture, data model, data layer, products, cart & checkout, auth & admin, email, SEO, routing, conventions, and environment.

Contributors using AI assistants: see **[CLAUDE.md](./CLAUDE.md)** for repo-specific guidance.

## License

Private / proprietary.
