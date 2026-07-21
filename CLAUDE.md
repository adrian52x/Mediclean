# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repo. Keep this file short and current — it's loaded into context every session. Details live in [`docs/`](./docs/README.md).

## What this is

**Dezinfect MD** (`mediclean`) — a Next.js 15 e-commerce storefront for a Moldovan company selling medical **disinfectants** and **equipment**. UI is in **Romanian**. Data is in **Supabase** (Postgres + Storage + Auth). There's an email-gated **admin panel** for managing products.

Full docs: **[docs/README.md](./docs/README.md)** — read the file relevant to your task before starting.

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run lint     # eslint
npm run format   # prettier
```

## Critical facts (read before touching code)

1. **There is no ORM.** The app queries **Supabase directly** via `@supabase/supabase-js`. No schema file lives in the repo; the schema is in Supabase and app shapes are hand-maintained in `types.ts`. (Prisma was removed.) Trust `types.ts` + `lib/api/*`. → [docs/data-model.md](./docs/data-model.md)
2. **Product writes go from the browser with the anon key** → security depends on **Supabase RLS**, not app code. The admin middleware only hides the UI. → [docs/auth-and-admin.md](./docs/auth-and-admin.md)
3. **Admin auth = email match against `NEXT_PUBLIC_ADMIN_EMAIL`/`EMAIL2`**, not the DB `role` column.
4. **Orders are NOT persisted** — checkout only sends an email. Any "order history" feature needs a new data layer. → [docs/cart-and-checkout.md](./docs/cart-and-checkout.md)
5. **Cart item id = `${productId}_${volume||'default'}`**; split on `_` to get the product id. → [docs/cart-and-checkout.md](./docs/cart-and-checkout.md)
6. **Two separate Resend API keys** (orders vs. verification). → [docs/email.md](./docs/email.md)
7. **`next.config.ts` hard-codes the Supabase image hostname** — update `remotePatterns` if the project changes.

## Conventions

- **Path alias `@/`** = repo root. Import `@/lib/...`, `@/components/...`, `@/types`.
- **All user-facing text is in Romanian.** Match it.
- **UI**: shadcn/ui primitives in `components/ui/` + Tailwind v4. Use `cn()` for conditional classes. Don't hand-roll basic UI.
- **Data flow**: components → TanStack Query hooks (`lib/hooks/`) → API classes (`lib/api/`) → Supabase. Mutations must invalidate the affected query keys (`["products"]`, `["newest-products"]`, `["product", id]`).
- **Secrets/server work**: service singletons in `lib/services/` behind API routes in `app/api/`, exposed via a `fetch` wrapper. Never put the service-role key or Resend keys in client code.
- **Server components by default**; push `'use client'` to leaf components. `params`/`searchParams` are async — `await` them.
- Match the **formatting/indentation of the file you're editing** (the repo mixes 2- and 4-space).
- Ignore `components/bin/` and `*.txt` action files — legacy/dead.

## Working style in this repo

- When a task touches data shapes, keep `types.ts` and the `ProductsAPI` `select` in sync.
- When you learn something non-obvious that future sessions would need, **update the relevant file in `docs/`** (and this file if it's a top-level fact).
- Before changing `middleware.ts`, test the storefront as a logged-out user (public-routes caveat in [docs/auth-and-admin.md](./docs/auth-and-admin.md)).
