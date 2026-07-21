# Authentication & Admin

## Summary

Auth exists **only for the admin**. Customers never log in — they browse and check out anonymously (email verification at checkout is a separate, code-based flow, not an account). Authentication is **Supabase Auth**; admin authorization is currently done by **matching the logged-in email against environment variables**, not the DB `role` column.

## Login

- Page: `app/auth/page.tsx` — **Google OAuth only** (`signInWithOAuth({ provider: 'google' })`). There is no email/password form.
- Callback: `app/auth/callback/route.ts` (Supabase auth code exchange), redirect target `${origin}/auth/callback`.
- Uses Supabase Auth via the clients in `lib/supabase/`.

## Route protection — `middleware.ts` → `lib/supabase/middleware.ts`

`middleware.ts` at the repo root delegates to `updateSession()`. The middleware **matcher** runs on all requests except static assets and images.

`updateSession()` does two things:

1. **Session refresh.** It creates a server Supabase client wired to the request/response cookies and calls `supabase.auth.getUser()`. (The comments warn: do not add code between client creation and `getUser()`, and never remove `getUser()` — doing so causes random logouts.)

2. **Route gating:**
   - If there's **no user** and the route is **not public**, redirect to `/login`.
     - Public routes (prefix match): `['/', '/login', '/auth', '/about', '/contact']`.
   - If the route starts with **`/admin`**, it calls `isUserAdmin()`; non-admins get a **rewrite to `/404`** (so the admin panel is invisible, not just forbidden).

   ⚠️ **Two quirks to be aware of before editing this:**
   - `/products` and `/checkout` are **not** in the public-routes list, yet the storefront must work for anonymous visitors. The redirect target is `/login`, which **has no page** (the real login is `/auth`). Whether logged-out users are actually redirected off `/products` depends on the exact `startsWith` matching and current behavior — **always test the storefront as a logged-out user after changing middleware.** If anonymous browsing/checkout breaks, add `/products` and `/checkout` to `publicRoutes` (or invert the model to only guard `/admin`).
   - The redirect goes to `/login` but the login page lives at `/auth`. Keep this in mind if you wire up any redirect-after-login logic.

### How admin is determined — `isUserAdmin()`
```ts
return userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    || userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL2;
```
So admin access is granted to **two specific email addresses** set in env. There are two other admin-check helpers that are **not** the active gate:
- `isAdminServerSide()` — queries the `users` table for `role === 'admin'` (present, but not what the middleware uses).
- `isUserAdminClientSide(session)` — client-side email match (for conditionally showing admin UI).
- The DB-role check inside the middleware is **commented out**.

> If you want to move to real role-based auth, the pieces are half-built: the `users.role` column exists and `isAdminServerSide()` reads it. You'd switch the middleware to use it and populate roles.

## Admin panel

Location: `app/(mediclean)/(protected)/admin/`.

- `layout.tsx` — wraps admin pages in a `SidebarProvider` + `AdminSidebar` (`components/admin/admin-sidebar.tsx`) with a theme toggle. Sidebar defaults to collapsed.
- `page.tsx` — the admin dashboard.

### Admin components (`components/admin/`)
- `AddProductForm.tsx` — create a product: fields, category, product type, medical-field flags, images, and volume/price rows.
- `ProductUpdateSheet.tsx` — edit an existing product in a slide-over sheet.
- `ProductTable.tsx` — list/manage products.
- `ImageUploadWithPreview.tsx` — multi-image upload with previews (calls `ImagesAPI.uploadMultipleImages`).
- `VolumePriceFields.tsx` — dynamic rows for volume-based pricing.

These write through the TanStack Query mutation hooks in `lib/hooks/useProducts.ts`, which invalidate the product caches so the storefront reflects changes.

## Security notes / things to watch

- Admin authz is **email-based via env vars**. Rotating an admin means editing env, not the DB.
- Product **writes happen from the browser** using the Supabase anon key. This means **Supabase Row Level Security (RLS) policies are what actually protect writes** — the middleware only hides the admin *UI*. If RLS is permissive, the anon key could theoretically be used to write outside the admin UI. **Verify RLS policies before assuming product mutations are locked down.** (This is the single most important security item to confirm in this codebase.)
- The email-verification service uses the **service role key** and is correctly server-side only (in `lib/services/`, called from API routes).
