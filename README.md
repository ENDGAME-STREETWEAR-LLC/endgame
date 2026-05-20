# ENDGAME Portal

Source code for the [ENDGAME](https://endgamestreetwear.com) web portal — a Next.js 15 + React 19 + Tailwind v4 + TypeScript app that combines a Shopify-backed shop with PSN / Xbox Live / Steam profile integrations.

## Prerequisites

Before you can run the app locally you'll need:

- **Node.js 18.18+** and **Yarn** (the project uses `yarn.lock`)
- A **Supabase** project (free tier is fine) — used for end-user auth and as the persistence layer for synced gaming data
- A **Shopify** store with **Admin API** access (a Custom App with read products + draft orders permissions)
- An **xbl.io** account if you want Xbox Live features — request a key at [xbl.io](https://xbl.io)
- The **endgame-express** server running — either locally ([repo](https://github.com/salvadorC03/endgame-express)) or via the [hosted deployment](https://endgame-express.vercel.app). Used for Xbox and Steam endpoints (PSN goes direct).

## Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in every value:

```bash
cp .env.example .env.local
```

| Variable | What it is | Where to get it |
|---|---|---|
| `EXPRESS_URL` | Base URL of the endgame-express API | Local (`http://localhost:<port>`) or `https://endgame-express.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Base URL of this Next.js app, no trailing slash | `http://localhost:3000` for local |
| `XBOX_API_KEY` | Server-side xbl.io key | xbl.io dashboard |
| `NEXT_PUBLIC_XBOX_APP_KEY` | Client-side xbl.io app key | xbl.io dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase project settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key | Supabase project settings → API |
| `NEXT_PUBLIC_REDIRECT_URL` | OAuth redirect target after Google sign-in | Usually `${NEXT_PUBLIC_API_URL}/auth/callback` |
| `SHOPIFY_DOMAIN` | Your Shopify store domain (e.g. `your-store.myshopify.com`) | Shopify admin |
| `SHOPIFY_ACCESS_KEY` | Admin API access token from a Shopify Custom App | Shopify admin → Apps → Develop apps |

If any of these are missing, `yarn build` and some pages will fail at module load.

### 3. Configure Supabase

In your Supabase project:

1. Enable **Google** as an OAuth provider under Authentication → Providers.
2. Set the redirect URL under Authentication → URL Configuration to match `NEXT_PUBLIC_REDIRECT_URL`.
3. Create three tables — `psn_data`, `xbox_data`, `steam_data` — each with the same shape:
   - `user_id` (uuid, foreign key to `auth.users.id`, unique)
   - `data` (jsonb)
   - whatever default columns Supabase adds (`id`, `created_at`)

   These are upserted on `user_id` whenever the user syncs their gaming profile.

### 4. Configure Shopify

In Shopify admin:

1. Create a Custom App with **read** access to Products and **read/write** access to Draft Orders.
2. Copy the Admin API access token into `SHOPIFY_ACCESS_KEY`.
3. The app is pinned to API version `2025-10` (see `src/app/api/shopify/route.ts`).

### 5. Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start the dev server with hot reload |
| `yarn build` | Production build (also runs lint + TypeScript checks) |
| `yarn start` | Run the production build |
| `yarn lint` | ESLint only (`next lint`) |

## Project structure

The site is organized around the concept of **biomes** — themed sub-experiences, each with its own URL.

```
src/
  app/                      ← Next.js App Router (file-based routing)
    page.tsx                ← / — the Nexus landing biome
    night-city/page.tsx     ← /night-city
    leonida/page.tsx        ← /leonida
    psn/home/page.tsx       ← /psn/home
    xbox/home/page.tsx      ← /xbox/home
    steam/home/page.tsx     ← /steam/home
    api/                    ← server-side API routes (Shopify, PSN, Xbox proxy, Steam proxy)
    layout.tsx              ← root layout, mounts providers + Navigation
  biomes/                   ← biome content (UI for each biome)
    nexus/                  ← landing biome
      Nexus.tsx
      biome-gates/          ← cards that link to other biomes
      transmissions/        ← drop notifications (built but not yet wired in)
    night-city/             ← cyberpunk-themed biome (currently houses the Shopify shop)
      shop/
    leonida/                ← placeholder biome
  components/               ← shared UI used across biomes (Navigation, Modal, gaming menus)
  hooks/                    ← React hooks (auth, gaming services, Shopify, localization)
  locales/                  ← en.ts / es.ts dictionaries — every user-facing string
  utils/supabase/           ← server- and client-side Supabase clients
  middleware.ts             ← runs on Xbox + Steam OAuth redirects
```

For deeper architecture notes (auth flows, data flow, conventions), see `CLAUDE.md`.

## Authentication flows

### PSN

Enter the Playstation Network using the link on the home page and sign in with your email and password. Then visit the link to retrieve the NPSSO token for your account, paste it into the input, and submit.

### Xbox Live

Click **Sign in with XBL** to authenticate. You'll need a Microsoft account with an Xbox Live profile associated. The xbl.io OAuth flow redirects back to `/xbox` and `src/middleware.ts` handles the token exchange before redirecting to `/xbox/home`.

### Steam

Click **Sign in with Steam** to authenticate via the official OpenID provider. You'll confirm identity on Steam each time you sign in.

## Disclaimer

None of your personal information will be stored or shared with anyone. All data accessed from your account will only be used to better provide our services and offer our products to you as a user of our platform.
