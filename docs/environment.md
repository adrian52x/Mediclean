# Environment & Local Setup

## Prerequisites

- Node.js (see `@types/node` ^20 → Node 20+ recommended)
- A Supabase project (Postgres + Storage + Auth)
- A Resend account with the `dezinfect.md` domain verified (or your own sender domain)
- Google OAuth configured in Supabase Auth (login is Google-only)

There is **no ORM** — data access is the Supabase SDK directly, so there's no schema file, migrations, or codegen step to run.

## Install & run

```bash
npm install          # install dependencies
npm run dev          # Next.js dev server (Turbopack) — http://localhost:3000
npm run build        # production build
npm run start        # run the production build
npm run lint         # eslint
npm run format       # prettier --write .
```

> There is no ORM and no `postinstall` codegen step — the app uses the Supabase SDK directly. See [architecture.md](./architecture.md).

## Environment variables

Two files (both gitignored):

### `.env` — server / database
| Var | Purpose |
|---|---|
| `DATABASE_URL` | Direct Postgres connection string. **Currently unused by the app** (was for Prisma); kept commented-out in `.env` for reference / future direct-DB use |
| `DIRECT_URL` | Direct Postgres connection. **Currently unused** (Prisma-era); kept commented-out for reference |
| `NODE_ENV` | environment |

> The app does not connect to Postgres directly — all DB access is via the Supabase SDK using the keys in `.env.local`. The two connection strings above are retained (commented out) only as a convenience if you ever need direct/psql access.

### `.env.local` — app runtime
| Var | Purpose | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | **Yes** (`NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser client) | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **secret**, server-only (email verification) | No — keep secret |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin email #1 (admin gate) | **Yes** |
| `NEXT_PUBLIC_ADMIN_EMAIL2` | Admin email #2 (admin gate) | **Yes** |
| `CC_EMAIL` | CC on order emails | No |
| `CC_EMAIL2` | Second CC on order emails | No |
| `RESEND_API_KEY_ORDERS` | Resend key for order-confirmation emails | No — secret |
| `RESEND_API_KEY_VERIFICATION` | Resend key for verification-code emails | No — secret |

### ⚠️ `NEXT_PUBLIC_` warning
Any var prefixed `NEXT_PUBLIC_` is **bundled into client JS and visible to anyone**. The admin emails are public by design (they're just an allow-list), but the actual security depends on Supabase RLS, not on hiding these. **Never** put a secret behind `NEXT_PUBLIC_`. `SUPABASE_SERVICE_ROLE_KEY` and both Resend keys are correctly non-public — keep them that way.

## Image optimization

`next.config.ts` allow-lists the Supabase storage hostname (`sfnpgydezdiiexmftraz.supabase.co`) for `next/image`, caches transformed images for a year, and limits device/image size variants. If you switch Supabase projects, **update the `remotePatterns` hostname** or product images will fail to load.

## Path alias

`@/*` maps to the repo root (`tsconfig.json`). Import as `@/lib/...`, `@/components/...`, `@/types`.

## Deployment

The `.vercel` entry in `.gitignore` and OG/canonical URLs imply **Vercel** hosting for `www.dezinfect.md`. Set all env vars in the Vercel project settings (Production + Preview).
