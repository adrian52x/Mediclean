# Email (Verification Codes & Order Confirmations)

Two email flows, both via **Resend**. They use **two separate Resend API keys**. Server-side logic lives in `lib/services/`, exposed through API routes, called from the client via `EmailAPI`.

There is a companion doc from earlier work: `lib/services/SERVICE_ARCHITECTURE.md` (singleton service pattern) and `lib/services/EMAIL_VERIFICATION_SETUP.md` (setup notes). This file is the practical overview.

## The two flows

| Flow | Trigger | Service | API route | Resend key |
|---|---|---|---|---|
| **Email verification** | User verifies email at checkout | `supabaseEmailVerificationService` | `/api/send-verification-code`, `/api/verify-email-code` | `RESEND_API_KEY_VERIFICATION` |
| **Order confirmation** | User submits an order | `resendEmailService` | `/api/send-order-email-resend` | `RESEND_API_KEY_ORDERS` |

## Client entry point — `EmailAPI` (`lib/api/EmailAPI.ts`)

Thin `fetch` wrappers (no Supabase). Used by the checkout form:
- `sendVerificationCode(email)`
- `verifyEmailCode(email, code)`
- `sendOrderConfirmationEmail(orderDetails)`

Each returns a typed response (`EmailVerificationResponse` / `OrderEmailResponse` in `types.ts`) with `success` + optional `error`/`message`.

## Email verification — `SupabaseEmailVerificationService`

File: `lib/services/supabaseEmailVerificationService.ts`. A **singleton** that uses the Supabase **service role key** (admin access to the `verification_codes` table) and Resend.

Rules:
- Codes are **6 digits**, TTL **10 minutes** (`EXPIRY_TIME`), max **3 attempts** (`MAX_ATTEMPTS`).
- Generating a code deletes any existing code for that email first, and lazily cleans up expired codes.
- `verifyCode()` handles: not found/expired, max-attempts-reached (deletes the code), correct (deletes and returns success), and wrong (increments attempts, returns remaining count). Error messages are in **Romanian** for the UI.
- Helpers: `hasValidCode()`, `getRemainingTime()` (seconds).
- The verification email HTML template is inline in the service (`generateVerificationEmailTemplate`), branded cyan, from `Dezinfect MD <noreply@dezinfect.md>`.

Key methods:
- `sendVerificationCodeEmail(email)` — generates + stores + emails the code (used by the API route).
- `verifyCode(email, inputCode)` — validates.

## Order confirmation — `ResendEmailService`

File: `lib/services/resendEmailService.ts`. Singleton, uses `RESEND_API_KEY_ORDERS`. `sendOrderConfirmation(orderDetails)` builds and sends the order email. The route (`/api/send-order-email-resend`) validates that `orderDetails`, `customer.email`, and `orderId` are present before calling it.

`CC_EMAIL` / `CC_EMAIL2` env vars exist to CC the business on order emails.

## API routes (`app/api/`)

- `send-verification-code/route.ts` — POST `{ email }` → sends a code.
- `verify-email-code/route.ts` — POST `{ email, code }` → verifies.
- `send-order-email-resend/route.ts` — POST `OrderDetails` → sends the order email. Has explicit validation + structured error/success responses.

## Gotchas

- **Two Resend keys.** Don't assume one key covers both flows; verification and orders are separated intentionally.
- The verification service **must stay server-side** — it holds the service role key. Never import it into a client component.
- Sender domain is `dezinfect.md`; that domain must be verified in Resend for delivery to work.
- Order confirmations are the **only** persistence of an order right now (see [cart-and-checkout.md](./cart-and-checkout.md) — orders aren't written to the DB).
