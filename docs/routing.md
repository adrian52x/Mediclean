# Routing (Next.js App Router)

The app uses the **App Router** with **route groups** (folders in parentheses that don't affect the URL) to separate the storefront from the admin area and to apply different layouts.

## Route tree

```
/                         → app/(mediclean)/(routes)/page.tsx           Home
/products                 → app/(mediclean)/(routes)/products/page.tsx  Product listing (+ ?category=)
/products/[id]            → app/(mediclean)/(routes)/products/[id]/page.tsx  Product detail
/checkout                 → app/(mediclean)/(routes)/checkout/page.tsx  Checkout
/admin                    → app/(mediclean)/(protected)/admin/page.tsx  Admin dashboard (gated)
/auth                     → app/auth/page.tsx                           Login (Google OAuth)
/auth/callback            → app/auth/callback/route.ts                  OAuth callback handler
/sitemap.xml              → app/sitemap.ts                              Dynamic sitemap
/api/send-verification-code    → route handler
/api/verify-email-code         → route handler
/api/send-order-email-resend   → route handler
```

## Route groups & layouts

- **`app/layout.tsx`** — root layout for everything. Sets up fonts (Inter), global CSS, `ThemeProvider`, `TanstackQueryProvider`, the `sonner` Toaster, SEO structured data, Google Analytics, and the nav progress bar. `<html lang="ro">`.

- **`(mediclean)`** — a grouping folder; no layout of its own beyond containing the two sub-groups.

- **`(routes)`** — the **public storefront**. Its `layout.tsx` renders the `Navbar` (passed the current session), `Footer`, and theme toggle, wrapping every storefront page. The navbar receives `session` from a server-side `supabase.auth.getUser()`.

- **`(protected)`** — the **admin area**. Its `admin/layout.tsx` renders the admin sidebar (`SidebarProvider` + `AdminSidebar`) instead of the storefront chrome. Access is enforced by **middleware**, not the layout (see [auth-and-admin.md](./auth-and-admin.md)).

- **`app/auth/`** — sits outside `(mediclean)`, so it gets only the root layout (a bare centered login card).

## Server vs client at the route level

- Storefront pages (`page.tsx` files) are **server components**. They read `searchParams`/`params` (which are async in Next 15 — note the `await params` / `await searchParams`) and generate SEO metadata, then delegate interactivity to client components.
- Example: `products/page.tsx` reads `?category=`, generates metadata + structured data server-side, and renders `<ProductsClientComponent/>` for the interactive filtering.
- `products/[id]/page.tsx` awaits `params`, then renders `<ProductPageView productId={id}/>`.

## Metadata

- Root metadata (title/description/OG/robots) is in `app/layout.tsx`.
- Home page overrides it in `app/(mediclean)/(routes)/page.tsx`.
- Product listing generates dynamic metadata per category via `generateProductsMetadata()` (`lib/seo/structured-data.ts`).
- See [seo.md](./seo.md).

## Middleware coverage

`middleware.ts` runs on all routes except static files and images (see its `matcher`). It refreshes the session and gates `/admin`. See [auth-and-admin.md](./auth-and-admin.md) for the exact rules and the public-routes caveat.
