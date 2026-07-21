# Conventions, Patterns & Gotchas

Read this before writing code in this repo. It captures the "how things are done here" that isn't obvious from any single file, plus the traps.

## Code conventions

- **TypeScript strict.** `types.ts` is the source of truth for domain shapes (`ProductDetails`, `CartItem`, `OrderDetails`, the enums). Keep it in sync with the DB and the Supabase `select`s.
- **Path alias `@/`** = repo root. Always import via `@/...`.
- **Formatting:** Prettier (`.prettierrc`) with the Tailwind class-sorting plugin. Run `npm run format`. Indentation in existing files is a mix (some 4-space, some 2-space) — **match the file you're editing.**
- **Styling:** Tailwind CSS v4 + `cn()` (from `lib/utils.ts`, = `clsx` + `tailwind-merge`) for conditional classes. UI primitives come from **shadcn/ui** in `components/ui/` (don't hand-roll buttons/inputs; use these). There's also some **daisyUI** in the mix.
- **UI language is Romanian.** All user-facing strings, error messages, and SEO copy are in Romanian. Match that.
- **Icons:** `lucide-react` (primary) and `react-icons` (e.g. the Google logo).

## Architectural patterns

- **Data access = static API classes** in `lib/api/` (e.g. `ProductsAPI.fetchProducts()`), which use the Supabase **browser** client. They throw on error.
- **Client fetching = TanStack Query hooks** in `lib/hooks/` wrapping those classes. Components use hooks, not the API classes directly. Query keys: `["products"]`, `["newest-products"]`, `["product", id]`. **Mutations must invalidate every affected key.**
- **Server-side/secret work = service singletons** in `lib/services/` (private constructor, `getInstance()`, env validation in the constructor), called from **API routes** in `app/api/`, exposed to the client via a `fetch` wrapper (`EmailAPI`). Pattern documented in `lib/services/SERVICE_ARCHITECTURE.md`.
- **Global client state = Zustand** (`lib/stores/`). Currently only the cart, persisted to localStorage.
- **Server components by default; push `'use client'` to the leaves** (forms, interactive filters, cart buttons).

## The big gotchas

1. **No ORM.** The app queries Supabase directly; there's no schema file in the repo. The real schema is in Supabase — reconstruct it from `types.ts` + the `lib/api/*` queries. See [data-model.md](./data-model.md). (Prisma was removed; if you see it referenced anywhere, that's stale.)

2. **Product writes happen from the browser with the anon key.** Security therefore depends on **Supabase RLS**, not on the app. Confirm RLS before assuming mutations are protected. The admin middleware only hides the *UI*.

3. **Admin auth is email-based via env vars** (`NEXT_PUBLIC_ADMIN_EMAIL`/`EMAIL2`), not the DB `role` column (which exists but isn't the active gate). See [auth-and-admin.md](./auth-and-admin.md).

4. **Orders are not persisted.** Checkout only emails the order. "Order history" / "admin orders" features require building a data layer first. See [cart-and-checkout.md](./cart-and-checkout.md).

5. **Cart item ids encode the volume:** `${productId}_${volume||'default'}`. To recover the product id, split on `_`. Different volumes are separate line items.

6. **Product image order matters** — `product_images[0]` is the primary image. Use `getPrimaryImage()`, not the deprecated `getPrimaryImageOLD()`.

7. **Middleware public-routes caveat** — `/products` and `/checkout` aren't listed as public and the redirect target `/login` has no page (login is at `/auth`). Test as a logged-out user after any middleware change.

8. **Two separate Resend keys** — one for orders, one for verification. Don't collapse them.

9. **`next.config.ts` hard-codes the Supabase image hostname.** Switching projects means updating `remotePatterns`.

10. **Async `params`/`searchParams`** in Next 15 — you must `await` them in server components.

## Dead / legacy code to ignore

- `components/bin/` — experimental/old navbars. Not used.
- `app/actions/productActions.txt` — a `.txt`, not wired in.
- `getPrimaryImageOLD()`, commented-out mutations in `useProducts.ts`, commented-out DB-role check in the middleware.
- `implementation.md` (personal setup notes), root-level `SEO_CHECKLIST.md` (historical), `todo.md` (personal notes, gitignored).

## Where things live (quick lookup)

| Need to... | Go to |
|---|---|
| Change a data query | `lib/api/*` + `lib/hooks/*` |
| Add a product field | `types.ts` → `ProductsAPI` select → admin form → display |
| Touch the cart | `lib/stores/cartStore.ts` |
| Touch checkout | `components/checkout/CheckoutForm.tsx` |
| Change emails | `lib/services/*` + `app/api/*` |
| Change SEO/business info | `lib/seo/structured-data.ts` |
| Change auth/admin gating | `lib/supabase/middleware.ts` |
| Change env/image domains | `.env.local` / `next.config.ts` |
| Add a shadcn component | `components/ui/` (via `components.json`) |
