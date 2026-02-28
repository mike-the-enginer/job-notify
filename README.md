# BB Job Radar

A modern Job Aggregator Progressive Web App (PWA) designed specifically to discover stable, entry-level, Monday-Friday jobs in Banská Bystrica.

## Architecture Highlights

- **Monorepo**: Powered by `pnpm` workspaces.
- **Backend (`apps/api`)**: Fastify REST API, Prisma with PostgreSQL, integration via `rss-parser`, scheduled with `node-cron`.
- **Frontend (`apps/web`)**: React + Vite PWA with Tailwind CSS styling and SWR for clean data fetching.
- **Shared (`packages/shared`)**: Single source of truth for TypeScript types and validations.

## Setup Instructions

Ensure you have Docker and Node 18+ installed.

1. **Install Dependencies**

   ```bash
   pnpm i
   ```

2. **Start the Database**

   ```bash
   docker compose up -d
   ```

3. **Environment Setup**
   Configure `.env` inside `apps/api`:

   ```bash
   DATABASE_URL="postgresql://jobuser:jobpassword@localhost:5432/jobnotify?schema=public"
   VAPID_PUBLIC_KEY="...your_public_key..."
   VAPID_PRIVATE_KEY="...your_private_key..."
   VAPID_MAILTO="mailto:admin@example.com"
   ```

4. **Generating VAPID Keys** (for Push Notifications)

   ```bash
   npx web-push generate-vapid-keys
   ```

   Add the output to `apps/api/.env`.

5. **Run Migrations**

   ```bash
   pnpm db:migrate
   ```

6. **Start Local Development**

   ```bash
   pnpm dev
   ```

7. **Build for Production**

   ```bash
   pnpm build
   ```

## Assumptions & Disclaimers

1. **Profesia.sk RSS assumption**: The ingestion utilizes Profesia's open RSS feed for general programmatic discovery. This minimizes load and adheres to common "personal / general feed" terms. Advanced headless scraping is explicitly avoided due to robots.txt restrictions.
2. **Kariera**: Kariera and other providers generally discourage direct DOM scraping through active blocks without API subscription access. For this MVP, I implemented Profesia as the sole connector in an extensible way, providing the blueprint for others via `rss-parser` should feeds be opened.
3. **Filtering Precision**: Filtering (entry level, shifts) is done via strict keyword pattern matching on Title and Description. Text inconsistencies may occasionally lead to false positives/negatives, which is standard for fuzzy-text aggregation APIs.
4. **PWA Offline**: React SWR caches the jobs payload, delivering an offline-compatible fast navigation experience. PWA manifest supports installability on mobile and modern desktops.

## Deployment Notes

- **API & Database**: Can be deployed easily on Fly.io using its Docker builder, or Render.
- **Web App**: Designed to be hosted on Vercel or Cloudflare Pages.
- During production deployment, make sure to expose `VITE_VAPID_PUBLIC_KEY` equal to `VAPID_PUBLIC_KEY` so the frontend knows the public key for Web Push manager.
