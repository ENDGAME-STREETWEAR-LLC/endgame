# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: yarn (see `yarn.lock`). All scripts are standard Next.js:

- `yarn dev` — start the dev server on http://localhost:3000
- `yarn build` — production build
- `yarn start` — run the production build
- `yarn lint` — `next lint` (ESLint flat config in `eslint.config.mjs`, extends `next/core-web-vitals` + `next/typescript`)

There is no test suite configured.

## External services this app depends on

The app does not run standalone — several env vars in `.env.example` must be filled in. Notable runtime dependencies:

- **endgame-express** (separate repo: https://github.com/salvadorC03/endgame-express) — proxied via `EXPRESS_URL`. The Xbox and Steam API routes (`src/app/api/xbox/*`, `src/app/api/steam/*`) are thin pass-throughs to this Express server. PSN routes do **not** go through Express; they call `psn-api` directly.
- **Supabase** — used for both end-user auth (Google OAuth via `@supabase/auth-ui-react`) and as the persistence layer for synced gaming data (tables: `psn_data`, `xbox_data`, `steam_data`, all keyed by `user_id`, with a JSON `data` column).
- **Shopify Admin API** — `src/app/api/shopify/route.ts` lists products and creates draft orders + sends invoices.
- **xbl.io** — Xbox Live OAuth flow; the app key is exchanged for a session in `src/middleware.ts`.

If you change the env-var contract, update `.env.example` — it is the documented source of truth.

## Architecture

Next.js 15 App Router + React 19 + Tailwind v4. TS path alias `@/*` → `./src/*`.

### The three "gaming services" (PSN / XBL / Steam) and their auth quirks

This is the bulk of the codebase, and each provider has a different sign-in shape that leaks into the architecture. Understanding which path you're on matters before changing anything in `src/app/api/*`, `src/middleware.ts`, or `src/hooks/useGamingServices.tsx`.

- **PSN** — token-based. User pastes a 64-char NPSSO token (constant `VALID_NPSSO_LENGTH`) on the home page. `getAccessToken` exchanges it for an `AuthTokensResponse` (psn-api). The session is the JSON-stringified token object, stored in a `psn_session` cookie. `refreshToken` route + `isExpired()` helper in `src/utils/api.ts` handle refresh.
- **XBL** — OAuth-redirect via xbl.io. The user is redirected to `/xbox?code=...`; `src/middleware.ts` intercepts that exact path, POSTs to `https://xbl.io/app/claim`, and writes an `xbox_session` cookie scoped to `/xbox/home` before redirecting there.
- **Steam** — OpenID redirect. The user is redirected to `/steam?openid.claimed_id=...`; the middleware extracts the user ID (the 6th `/`-segment of `openid.claimed_id`) and writes it to a `steam_session` cookie scoped to `/steam/home`.

The `matcher` in `src/middleware.ts` is `["/xbox", "/steam"]` and is an exact-path match — adding new auth-redirect paths means updating both the `REQUEST_MATCHERS` switch and the `config.matcher` array (Next.js requires string-literal matchers).

`src/app/layout.tsx` reads all three cookies server-side on every request and passes them into `<GamingServicesContextProvider value={session}>`. Components do NOT read cookies directly — they consume `useGamingServices()`.

### Data flow

```
RootLayout (cookies → session)
  └─ LocalizationProvider           (en/es, picks from navigator.language)
      └─ AuthContextProvider        (Supabase session; gates behind Google sign-in)
          └─ GamingServicesContextProvider  (raw cookie session strings)
              └─ Navigation + page
```

Inside `useGamingServices` (`src/hooks/useGamingServices.tsx`), `sync(service)` for each provider:
1. Reads the cookie session from context.
2. Calls one or more internal `/api/<service>/...` routes via `fetcher` (`src/utils/api.ts`).
3. `upsert`s the resulting blob into the Supabase `<service>_data` table on `user_id`.
4. Caches in local React state (`psnData` / `xblData` / `steamData`).

`logout(service)` deletes the Supabase row and clears local state but does **not** clear the auth cookie — that's a quirk to be aware of.

### Commit hygiene

Prefer **small, focused commits** over one large blob. Each commit should be a testable unit of work — one logical change at a time — so the git log reads like a story and `git bisect` / partial rollbacks stay surgical. When a task spans multiple concerns (refactor + new feature + docs), split it into separate commits with their own messages. Avoid lumping unrelated edits into a single "WIP" commit.

### Commit message format

Follow **Conventional Commits** + the **50/72 rule**:

```
<type>(<optional-scope>): <subject>

<body, wrapped at 72 chars>

<optional footer (refs, breaking changes, co-authors)>
```

- **Subject line:** ≤ 50 characters, imperative mood ("add X", not "added X" or "adds X"), no trailing period.
- **Blank line** between subject and body, and between body and footer.
- **Body:** wrap each line at 72 characters. Explain *why* the change was made, not *what* (the diff already shows what).
- **Type** is one of: `feat` (new user-facing feature), `fix` (bug fix), `refactor` (code restructuring with no behavior change), `docs`, `style` (formatting), `test`, `chore` (tooling, deps, config), `perf`, `build`, `ci`.
- **Scope** is optional and free-form, usually a biome or module name (e.g. `nexus`, `night-city/shop`, `auth`).

Example:

```
refactor(nexus): extract shop into night-city biome

Move MainApp + ShopItem into src/biomes/night-city/shop/ and rename
MainApp to Shop. The Shopify-integrated grid was conflated with the
landing experience; splitting it lets each biome own its own UI.
```

### Conventions

- All endpoint URLs live in the `Object.freeze`'d maps (`PsnEndpoints`, `XboxEndpoints`, `SteamEndpoints`) in `src/utils/api.ts`. Add new routes there so the union `Endpoint` type stays exhaustive — `fetcher` is typed against it.
- Internal API routes follow Next.js App Router conventions: each endpoint is a folder under `src/app/api/<service>/<name>/route.ts` exporting `GET`/`POST`.
- Server-side and browser-side Supabase clients are separate: `src/utils/supabase/server.ts` (uses `cookies()` from `next/headers`) vs `src/utils/supabase/client.ts`.
- Strings shown to users go through `useLocalization()` and live in `src/locales/{en,es}.ts`.
- Constants for auth flows (PSN sign-in URL, NPSSO endpoint, Steam OpenID params) live in `src/constants/auth.ts`. The Steam params are built into a query string at module load using `NEXT_PUBLIC_API_URL` — that env var must be set or Steam sign-in URLs will be malformed.
