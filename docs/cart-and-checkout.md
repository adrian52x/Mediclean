# Cart & Checkout

## Cart — `lib/stores/cartStore.ts` (Zustand)

The cart is **client-only**, stored in a Zustand store persisted to `localStorage` under the key `mediclean-cart-storage`. There is no server-side cart.

### Shape
```ts
interface CartItem {
  id: string;        // `${productId}_${volume || 'default'}` — the dedupe key
  productId: string;
  title: string;
  price: number;     // resolved at add-time (volume price or base price)
  quantity: number;
  volume?: string;   // set for volume-priced disinfectants
  image: string;     // primary image URL, falls back to the logo
}
```

The store also keeps **computed** `cartCount` and `totalPrice`. These are recomputed on every mutation (via `calculateComputedValues`) and re-derived on rehydration from localStorage (`onRehydrateStorage`). Only `cartItems` is persisted; the computed fields are rebuilt.

### Actions
- `addItem(product, quantity=1, volume?)` — builds the item key as `${product.id}_${volume||'default'}`. If it exists, bumps quantity; otherwise creates a line item. Price resolution: if `volume` is passed, it looks up `product.product_volumes_price` for that volume and falls back to `product.price`.
- `removeItem(itemId)`
- `updateQuantity(itemId, quantity)` — quantity ≤ 0 removes the item.
- `clearCart()`

### Key takeaways / gotchas
- **The item id encodes the volume.** Two volumes of the same product are two separate lines. When you need the raw product id (e.g. to link back to the product page), split on `_`: `item.id.split('_')[0]` — this is what the checkout summary does.
- Because the cart is localStorage-only, it's per-browser and survives reloads but not device changes.
- The cart badge / drawer lives in `components/navbar/CartNav.tsx`.

## Checkout — `components/checkout/CheckoutForm.tsx`

Route: `/checkout` (`app/(mediclean)/(routes)/checkout/page.tsx`). One big client component. This is a **public** route — no login required to order.

### Flow
1. **Empty-cart guard** — if the cart is empty, it shows a "coșul tău este gol" message and a link back to products.
2. **Customer form** — name, phone, email, optional bank details.
3. **Email verification (required to submit):**
   - User clicks "Verifică" → `EmailAPI.sendVerificationCode(email)` → a 6-digit code is emailed (see [email.md](./email.md)).
   - User enters the code → `EmailAPI.verifyEmailCode(email, code)`.
   - State machine: `emailVerificationStep: 'none' | 'sending' | 'sent' | 'verified'`.
   - Changing the email address resets verification.
4. **Delivery method** — `'delivery'` (free in Chișinău) or `'postalDelivery'` (+fee). Address fields are required for both.
5. **Order summary** — line items, quantities, per-item totals, grand total (currency **MDL**).
6. **Submit** — disabled until name, phone, email, address, city are filled, email has no validation error, **and** email is verified.

### On submit (`handleSubmit`)
Builds an `OrderDetails` object (`types.ts`) with:
- `orderId` from `generateOrderId()` → format `DEZ-DD/MM/YYYY-HHMM-RR` (see `lib/utils.ts`).
- `timestamp`, customer info, delivery info, mapped cart items, and a summary.

Then calls `EmailAPI.sendOrderConfirmationEmail(orderDetails)`. On success: `alert(...)` confirmation + `clearCart()`. On failure: an error `alert`.

### ⚠️ Important limitation
**Orders are not saved anywhere.** The only durable output of a checkout is the confirmation email sent via Resend. Persisting orders to the DB (order number, customer, items, timestamp) is an open TODO (`todo.md`). If a task involves "order history", "admin orders list", or "resend an order", that data layer **does not exist yet** and must be built.

### UX notes
- Confirmations currently use native `alert()` (not the `sonner` toast used elsewhere). If polishing UX, that's an easy upgrade.
- Delivery fee is referenced in the UI copy but the price breakdown lines for subtotal/fee are commented out — the total shown is just the products total.
- Email validation is done inline with `validateEmail()` from `lib/utils.ts`.
