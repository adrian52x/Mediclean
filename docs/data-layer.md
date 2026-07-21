# Data Layer

How data moves between the UI and Supabase. There are **two paths**: direct Supabase (for products/images) and API routes (for email, which needs the service role key / server secrets).

## Supabase clients (`lib/supabase/`)

| File | Client | Used by |
|---|---|---|
| `browser.ts` | `supabaseBrowser()` — anon-key client for the browser | All `lib/api/*` classes (product/image/type reads & writes) |
| `server.ts` | `supabaseServer()` — cookie-aware server client (`@supabase/ssr`) | Server components, admin checks |
| `middleware.ts` | Session refresh + route protection helpers | `middleware.ts` at the repo root |

The **service role key** is used only inside `lib/services/supabaseEmailVerificationService.ts` (server-side, for the `verification_codes` table). Never import that into client code.

## API classes (`lib/api/`)

Static classes that wrap Supabase queries. They throw on error (callers/TanStack Query handle it).

### `ProductsAPI`
The main one. Methods:
- `fetchProducts()` — all products (ordered by `updated_at` desc), with joins.
- `fetchNewProducts()` — latest 8 by `created_at` (homepage grid).
- `fetchProductById(id)` — single product with joins.
- `addProduct(product)` — insert, returns new `id`.
- `updateProduct(id, updates)` — partial update, returns full joined product.
- `deleteProduct(id)` — **also deletes storage files** (images + PDF) by parsing their public URLs, then deletes the row.
- `addProductImage(...)` / `deleteProductImages(productId)`
- `addProductVolumePrice(...)` / `deleteProductVolumePrices(productId)`

All product reads use the same joined `select` (see [data-model.md](./data-model.md)).

### `ImagesAPI`
Supabase Storage operations:
- `uploadMultipleImages(files, title, price)` — bulk upload to `product-images`, returns public URLs + paths.
- `uploadImage(...)`, `uploadPdf(...)` — single uploads.
- `getProductsImages()`, `getServicesImages()` — list a bucket + build public URLs.
- `deleteFiles(bucket, paths)` — remove one or many files.

### `ProductTypesAPI`
- `fetchProductTypes()` — the `product_types` lookup, used for filters and the admin form.

### `EmailAPI`
**Not** a Supabase wrapper — it's a thin `fetch` wrapper around the `/api/*` route handlers:
- `sendVerificationCode(email)` → `POST /api/send-verification-code`
- `verifyEmailCode(email, code)` → `POST /api/verify-email-code`
- `sendOrderConfirmationEmail(orderDetails)` → `POST /api/send-order-email-resend`

See [email.md](./email.md).

## TanStack Query hooks (`lib/hooks/`)

Client components never call the API classes directly for products — they use these hooks so results are cached/invalidated consistently.

### `useProducts.ts`
Query keys in use: `["products"]`, `["newest-products"]`, `["product", id]`.

Queries:
- `useGetProducts()` → `["products"]`
- `useGetNewProducts()` → `["newest-products"]`
- `useGetProductById(id)` → `["product", id]`

Mutations (each invalidates the relevant keys on success):
- `useCreateProducts()`, `useUpdateProduct()`, `useDeleteProduct()`
- `useAddProductImage()`, `useDeleteProductImages()`
- `useAddProductVolumePrice()`, `useDeleteProductVolumePrices()`

**Invalidation pattern:** mutations call `queryClient.invalidateQueries` for `["products"]`, `["newest-products"]`, and (for updates) `["product", id]`. If you add a new product query key, remember to invalidate it in the relevant mutations or the admin UI will show stale data.

### `useProducTypes.ts` (note the typo in the filename)
- `useGetProductTypes()` → fetches `product_types` for the filter UI.

### `useMobile-sidebar.ts`
UI-only hook for the mobile sidebar open/close state.

## Provider setup

`providers/TanstackQueryProvider.tsx` wraps the app (mounted in `app/layout.tsx`) and creates the `QueryClient`. All hooks depend on this being in the tree.

## Adding a new data operation — checklist

1. Add the query/mutation to the relevant `lib/api/*` class (or create a new class).
2. Wrap it in a TanStack Query hook in `lib/hooks/` (query key naming: `["<entity>"]` or `["<entity>", id]`).
3. On mutations, invalidate every query key that the change affects.
4. Keep `types.ts` in sync if the shape changes (and the joined `select` in `ProductsAPI`).
5. If the operation needs secrets/service-role access, put it behind an **API route** + a service in `lib/services/`, and expose it via an `EmailAPI`-style fetch wrapper — do **not** do it in the browser client.
