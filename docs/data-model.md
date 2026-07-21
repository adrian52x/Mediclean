# Data Model (Supabase / PostgreSQL)

> **There is no ORM.** The app queries Supabase directly via the `@supabase/supabase-js` SDK (PostgREST under the hood). Prisma was an early experiment and has been **fully removed** from the project. The authoritative schema is Supabase itself; the tables below are reconstructed from `types.ts` and the actual queries in `lib/api/*`, which are the real source of truth. If you change a table in Supabase, update `types.ts` (and regenerate `types_db.ts` with `supabase gen types typescript`) by hand — nothing infers types for you.

## Tables

### `products`
The central catalog table.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | `gen_random_uuid()` |
| `title` | text | |
| `description` | text · nullable | Rich text; rendered via `lib/utils/textFormatter.tsx` |
| `price` | int · nullable | Base/fixed price in **MDL**. Null when the product uses volume-based pricing |
| `category` | text (`'disinfectants'` \| `'equipment'`) | See `CategoryEnum` in `types.ts` |
| `product_type` | uuid (FK → `product_types.product_type_id`) | Stored as FK; queried as a joined `{ type_name }` object |
| `stomatologie` | bool | Medical field flag (dentistry) |
| `medicina_generala` | bool | Medical field flag (general medicine) |
| `doc_url` | text · nullable | Public URL of a product PDF (in `product-pdfs` bucket) |
| `image` | text | Legacy single-image column. Real images live in `product_images` |
| `created_at` | timestamptz | Used for "new products" ordering on the homepage |
| `updated_at` | timestamptz | Used for default catalog ordering |

### `product_types`
Lookup table for product types (e.g. "Dezinfectant mâini"). Drives the filter sidebar.

| Column | Type | Notes |
|---|---|---|
| `product_type_id` | uuid (PK) | |
| `type_name` | text | Displayed to users and used in filtering/search |

Queried via `ProductTypesAPI.fetchProductTypes()`.

### `product_images`
One-to-many with `products`. A product has up to ~3 images; **the first row in the array is the primary image** (order matters).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `product_id` | uuid (FK → `products.id`) | |
| `url` | text | Public URL in the `product-images` storage bucket |

### `product_volumes_price`
One-to-many with `products`. Used for disinfectants sold in multiple volumes (100ml, 500ml, 1L, …), each with its own price.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `product_id` | uuid (FK → `products.id`) | |
| `volume` | text | e.g. `'500ml'`, `'1L'` — see `DisinfectantVolumeEnum` |
| `price` | int | Price in MDL for that volume |

Pricing model: a product is either **fixed price** (`products.price` set, no volume rows) or **volume-priced** (`products.price` null, rows in `product_volumes_price`). See `PriceTypeEnum` in `types.ts`.

### `verification_codes`
Backs email verification during checkout. Managed by `SupabaseEmailVerificationService` using the **service role key** (server-side only).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `email` | text | One active code per email (old ones deleted on regenerate) |
| `code` | text | 6-digit code |
| `attempts` | int | Max 3 before invalidation |
| `created_at` | timestamptz | |
| `expires_at` | timestamptz | 10-minute TTL; expired rows cleaned up lazily |

### `users`
Present in the schema; used to store roles. **In practice, admin gating currently uses email matching against env vars, not this table** — see [auth-and-admin.md](./auth-and-admin.md). There is also a commented-out DB-role check in the middleware.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Matches the Supabase Auth user id |
| `email` | text unique | |
| `password` | text · nullable | |
| `role` | text | default `'user'` (the `role === 'admin'` check exists in code but is not the active gate) |
| `created_at` | timestamptz | |

### `services`
The app fetches **service images** from a storage bucket for the hero section, but there is no active use of a `services` table in the read paths reviewed. Treat as unused/low-priority.

## Relationships

```
product_types ──1:N──> products
products ──1:N──> product_images
products ──1:N──> product_volumes_price

Supabase Auth user ──1:1──> users (role) [not the active admin gate]
verification_codes: keyed by email (transient)
```

## How products are queried (the canonical select)

Every product read joins the related tables in one Supabase query:

```ts
supabase.from('products').select(`*,
    product_type(type_name),
    product_images(url),
    product_volumes_price(volume, price)
`)
```

This is why the `ProductDetails` type (in `types.ts`) has nested `product_type`, `product_images`, and `product_volumes_price`. When adding fields, keep the type and this select in sync.

## Storage buckets (Supabase Storage)

| Bucket | Contents | Naming convention |
|---|---|---|
| `product-images` | Product photos | `{safeTitle}_{price}_{timestamp}_{idx}.{ext}` (multi-upload) |
| `product-pdfs` | Product spec sheets / docs | `{safeTitle}_{price}_.{ext}` |
| `services-images` | Hero/consultation images | free-form |

Deleting a product also deletes its files: `ProductsAPI.deleteProduct()` parses filenames out of the public URLs and removes them from the buckets before deleting DB rows.

## Regenerating DB types

`types_db.ts` holds generated Supabase types. If you change the schema in Supabase, regenerate them with the Supabase CLI (`supabase gen types typescript`) and reconcile `types.ts`.
