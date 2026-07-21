# Products (Catalog, Filtering, Detail)

Everything about browsing products. Components live under `components/product/`.

## Component map

```
components/product/
├── ProductCard.tsx                     # Single product card (used in grids)
├── ProductsGrid.tsx                    # Homepage "new products" grid (uses useGetNewProducts)
├── AllProductsPage/                    # The /products listing experience
│   ├── ProductsClientComponent.tsx     # Orchestrator: owns filter + search state
│   ├── ProductFiltersComponent.tsx     # Filter sidebar (categories, types, medical fields)
│   ├── ProductSearch.tsx               # Search input
│   ├── FilteredProductsGrid.tsx        # Runs filterProducts() and renders results
│   └── README.md                       # (older, detailed filter-system notes — still accurate)
└── ProductPage/                        # The /products/[id] detail experience
    ├── ProductPageView.tsx             # Detail orchestrator (fetches by id)
    ├── ProductPageImage.tsx            # Image gallery
    ├── ProductPageInfo.tsx             # Title, description, type, medical fields
    ├── ProductPagePurchaseAndPdf.tsx   # Volume/price selector, add-to-cart, PDF link
    └── SimilarProducts.tsx             # Related products
```

> There's a per-feature `README.md` inside `AllProductsPage/` with a deep dive on the filter data flow. It predates this docs folder but is still correct — read it if you're working on filtering specifically.

## Categories, types, and medical fields

A product is classified three ways (all filterable):

1. **Category** — `disinfectants` or `equipment` (`CategoryEnum` in `types.ts`, stored in `products.category`).
2. **Product type** — a free-form lookup from the `product_types` table (e.g. "Dezinfectant mâini").
3. **Medical field** — two booleans on the product: `stomatologie` and `medicina_generala`.

## Listing page (`/products`)

`ProductsClientComponent.tsx` is the orchestrator. It:
- Fetches all products with `useGetProducts()` and types with `useGetProductTypes()`.
- Owns the filter + search state:
  ```ts
  const [filters, setFilters] = useState<ProductFilters>({
      categories: [], productTypes: [], medicalFields: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  ```
- Passes state down to the filter sidebar, search input, and grid.

### Filtering logic — `filterProducts()` in `lib/utils.ts`

This is the single source of truth for filtering (memoized in the grid). Rules:
- **Search** matches against `title`, `description`, and `product_type.type_name` (case-insensitive).
- **Category / product type / medical field** filters use **AND across categories, OR within a category**: a product must satisfy every *active* filter group, and within a group it matches if it satisfies any selected value.
- Empty filter arrays are ignored (no filtering).

`getFilteredProductsCount()` reuses the same function for the results count.

Category deep-links work too: `/products?category=disinfectants` is read by the server component for SEO metadata; the client component drives the interactive filtering.

## Product detail page (`/products/[id]`)

`app/(mediclean)/(routes)/products/[id]/page.tsx` is a thin server component that awaits `params` and renders `ProductPageView` with the id. `ProductPageView` fetches the product via `useGetProductById(id)` and composes the image gallery, info, purchase panel, and similar products.

### Images
- Stored in `product_images` (and the `product-images` bucket).
- **The first image in the array is the primary image.** Use `getPrimaryImage(product)` from `lib/utils.ts` — it returns `product_images[0]?.url` and falls back to `/images/mediclean-logo.jpg`.
- `getPrimaryImageOLD()` (deprecated) picked the image whose filename ended in `_1`; don't use it for new code.

### Pricing & add-to-cart
- **Fixed-price product:** `products.price` is set; add-to-cart uses that price.
- **Volume-priced product:** `products.price` is null; the user picks a `volume`, and the price comes from the matching `product_volumes_price` row. The cart item key is `${productId}_${volume}` so different volumes are separate line items.
- See the cart logic in [cart-and-checkout.md](./cart-and-checkout.md).

### PDF
If `products.doc_url` is set, the purchase panel shows a link to the product's PDF (spec sheet) hosted in the `product-pdfs` bucket.

## Descriptions / rich text

Product descriptions are formatted through `lib/utils/textFormatter.tsx` (and previews via `lib/utils/textPreview.ts`). If descriptions render oddly, look there.

## Adding a product field — end-to-end

1. Add the column in Supabase.
2. Add it to `ProductDetails` (and `InsertProduct` if it's user-set) in `types.ts`.
3. If it needs to come back from reads, make sure it's covered by `*` in the `ProductsAPI` select (or add the join).
4. Surface it in the admin form (`components/admin/AddProductForm.tsx` / `ProductUpdateSheet.tsx`).
5. Display it in `ProductPageInfo.tsx` / `ProductCard.tsx` as needed.
6. If it's filterable, extend `ProductFilters` (in `types.ts`) and `filterProducts()` (in `lib/utils.ts`) plus the filter sidebar.
