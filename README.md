<a href="https://advents.io">
  <img alt="Advents platform preview." src="https://github.com/advents-io/docs/blob/main/.github/preview-app.png" />
</a>

<h2 align="center">Advents</h2>

<p align="center">
  The platform to grow your app.
  <br />
  Advents is an alternative to AppsFlyer and Firebase Dynamic Links.
  <br />
  <br />
  <a href="https://advents.io">Website</a>
  ·
  <a href="https://app.advents.io">Platform</a>
  ·
  <a href="https://docs.advents.io">Docs</a>
</p>

Advents is a mobile attribution and deep-linking platform focused on app install campaigns.
In product metadata and docs, it is positioned as an alternative to AppsFlyer and Firebase
Dynamic Links.

This repository contains the main Advents platform (`app.advents.io`), including:

- dashboard UI,
- API endpoints for dashboard and SDK traffic,
- click redirect middleware,
- attribution logic,
- shared data/domain packages.

## Documentation

For getting started, please check our official documentation:

[https://docs.advents.io](https://docs.advents.io)

## Core capabilities

- Team/app management with authenticated dashboard access.
- Short links with per-link `iosUrl`, `androidUrl`, and `fallbackUrl`.
- Click redirect and logging with device/referrer/geolocation metadata.
- iOS preview page flow that writes `click_id` to clipboard before App Store redirect.
- SDK event ingestion (`/api/events`) for session and purchase events.
- Deterministic and probabilistic attribution for installs/events.
- Analytics endpoints for clicks, installs, CTI, and revenue.
- Apple Universal Links and Android App Links via `/.well-known` handlers.

## Monorepo structure

This repo uses pnpm workspaces for `apps/*` and `packages/*`.

| Path                           | Purpose                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `apps/web`                     | Next.js app (dashboard UI, middleware, route handlers).                                     |
| `packages/common`              | Shared constants/utilities (routes, URL/store helpers, etc.).                               |
| `packages/db`                  | Prisma schema, migrations, seed scripts, DB client export.                                  |
| `packages/supabase`            | Supabase browser/server/middleware clients.                                                 |
| `packages/queries`             | Authenticated dashboard query API (`/api`).                                                 |
| `packages/engine`              | Click routing/logging, SDK events API (`/api/events`), attribution, `.well-known` handlers. |
| `packages/internal`            | Internal API (`/api/internal`) for team/user admin flows.                                   |
| `packages/mutations`           | Next server actions (create/edit app, links, domains, deep-link config, etc.).              |
| `modules/docs`                 | Mintlify docs site (separate project; not in pnpm workspace).                               |
| `modules/advents-react-native` | React Native SDK source (separate project; not in pnpm workspace).                          |

## Request flow (high level)

1. User clicks a short link on a link domain.
2. Next.js middleware detects non-web domains and delegates to click middleware.
3. Middleware resolves destination by OS:
   - iOS: may route through `/ios/preview` for clipboard-based attribution,
   - Android: appends `referrer=advents_click_id=...` for deterministic referrer attribution,
   - others: uses fallback URL.
4. Click data is logged asynchronously and link counters are incremented.
5. Mobile SDK sends session/purchase events to `/api/events`.
6. Attribution engine links installs/events to clicks and updates analytics aggregates.
7. Dashboard reads analytics/config via authenticated `/api` query routes.

## Tech stack

- Next.js 15 (App Router), React 19 RC, TypeScript
- Hono (mounted in Next route handlers)
- Prisma + PostgreSQL
- Supabase Auth + storage/client access
- Tailwind + Radix UI
- Zod validation
- `next-safe-action` for server actions
- Optional PostHog client instrumentation

## Prerequisites

- Node.js 20+ (recommended)
- pnpm 9+
- PostgreSQL database (for Prisma datasource)
- Supabase project (Auth + keys used by app/services)

## Environment variables

Primary environment file used by the app and Prisma scripts:

- `apps/web/.env.local`

No `.env.example` is currently present in the repository.

Required (core runtime):

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Optional (feature/deployment dependent):

```bash
ADMIN_USERS=<supabase_user_id_1>,<supabase_user_id_2>
NEXT_PUBLIC_POSTHOG_KEY=...

NEXT_PUBLIC_VERCEL=1
NEXT_PUBLIC_VERCEL_ENV=production
VERCEL=1
VERCEL_ENV=production

OPENAI_API_KEY=... # used by AI slug generation action
```

## Local development

1. Install workspace dependencies:

   ```bash
   pnpm install
   ```

2. Create and fill `apps/web/.env.local` with the variables above.

3. Prepare database:

   ```bash
   pnpm --dir packages/db run generate
   pnpm --dir packages/db run migrate
   ```

4. (Optional) Seed development data:

   ```bash
   pnpm --dir packages/db run seed
   ```

5. Start the web app:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

### Local link-domain testing

Link handling is domain-based. In local development, requests using
`*.localhost:3000` are treated as link domains (for example:
`myapp.localhost:3000/some-slug`).

## API overview

### Dashboard API (`/api`)

- Auth: `Authorization: Bearer <supabase_access_token>`
- Main routes:
  - `GET /api/team/:teamSlug/app/:appSlug/analytics`
  - `GET /api/team/:teamSlug/app/:appSlug/links/analytics`
  - `GET /api/team/:teamSlug/app/:appSlug/domains`
  - `GET /api/team/:teamSlug/app/:appSlug/default-values`
  - `GET /api/team/:teamSlug/app/:appSlug/qrcode-logo`
  - `GET /api/link/:linkId`

### SDK events API (`/api/events`)

- Auth: `Authorization: Bearer <app_api_key>`
- Required header: `Advents-Device-Id: <device_id>`
- Routes:
  - `POST /api/events/sessions`
  - `POST /api/events/purchases`

### Internal API (`/api/internal`)

- Auth: `Authorization: Bearer <supabase_access_token>`
- Routes:
  - `POST /api/internal/team`
  - `POST /api/internal/user`
  - `POST /api/internal/teams/add-admins`

### Well-known routes

- `GET /.well-known/apple-app-site-association`
- `GET /.well-known/assetlinks.json`

These are generated per app/domain configuration and used for
iOS Universal Links / Android App Links.

## Useful scripts

From repository root:

- `pnpm dev` - run web app (`apps/web`) in dev mode.
- `pnpm lint` - run ESLint + Prettier (+ SDK lint in `modules/advents-react-native`).
- `pnpm clear` - clean `node_modules`, build artifacts, and caches.
- `pnpm doc dev` - run docs app in `modules/docs` on port `3001`.
- `pnpm --dir apps/web run build` - production build for web app.
- `pnpm --dir apps/web run migrate:prod` - deploy Prisma migrations.
- `pnpm --dir packages/db run studio` - open Prisma Studio.

## Docs and SDK modules

`modules/docs` and `modules/advents-react-native` are not listed in
`pnpm-workspace.yaml`, so manage them as separate package projects when needed.

Examples:

```bash
cd modules/docs
pnpm install
pnpm dev
```

```bash
cd modules/advents-react-native
pnpm install
pnpm build
```

## Deployment notes

- Web deployment is Vercel-oriented (`apps/web/vercel.json` sets region `gru1`).
- Runtime domain helpers switch behavior between local/Vercel/prod contexts.

## Contributing

1. Fork the repository.
2. Create your branch (`git checkout -b feature/my-change`).
3. Make changes and run lint checks.
4. Open a pull request.

## License

This project is licensed under the GNU Affero General Public License Version 3 (AGPLv3) or any later version - see the [LICENSE](LICENSE.md) file for details.
