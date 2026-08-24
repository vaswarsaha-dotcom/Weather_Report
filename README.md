# WeatherSphere Pro

A production-quality, white-label weather SaaS built with Next.js 15, MongoDB, and Open-Meteo. Live forecasts, historical trends, smart alerts, interactive maps, an embeddable widget, and a full admin panel — ready to run, brand, and sell.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Forms | React Hook Form + Zod |
| Backend | Next.js Route Handlers, Mongoose (MongoDB) |
| Auth | JWT (httpOnly cookie) + bcrypt |
| Weather data | Open-Meteo (primary, no key required) with OpenWeatherMap as an automatic fallback |
| Maps | Leaflet + react-leaflet, OpenStreetMap tiles |
| Deployment | Vercel |

## Project structure

```
app/
  (auth)/            login, signup, forgot-password pages + shared auth layout
  admin/              admin panel (overview, users) — role-gated
  api/                route handlers: auth, weather, geocode, history, alerts, admin, cron
  dashboard/           user dashboard: overview, maps, history, alerts, widget builder, branding
components/
  landing/            marketing site sections
  dashboard/           dashboard widgets (city search, forecast cards, charts, states)
  admin/               admin shell/nav
  ui/                  Button, GlassCard, Input primitives
lib/                  weather.ts, geocode.ts, summary.ts, auth.ts, db.ts, alerts.ts, rateLimit.ts
models/               User, Alert, WeatherSnapshot (Mongoose schemas)
hooks/                useAuth, useWeather, useGeolocation, useFavorites
types/                shared weather types
public/               weather-widget.js — the embeddable script
scripts/              seed-admin.ts — CLI to create/promote an admin user
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

- `MONGODB_URI` — your MongoDB connection string (see below)
- `JWT_SECRET` — any long random string (`openssl rand -base64 32`)
- `OPENWEATHER_API_KEY` — optional, only needed for the fallback weather provider
- `CRON_SECRET` — a random string to protect the alert-checking endpoint

### 3. Set up MongoDB

**Option A — MongoDB Atlas (recommended for production)**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow network access from your IP (or `0.0.0.0/0` for Vercel).
3. Copy the connection string into `MONGODB_URI`.

**Option B — local MongoDB**

```bash
docker run -d -p 27017:27017 --name weathersphere-mongo mongo:7
```

```
MONGODB_URI=mongodb://localhost:27017/weathersphere
```

### 4. Create your first admin account

```bash
npm run seed:admin -- --email you@company.com --password "Str0ngPass!1" --name "You"
```

This creates the account if it doesn't exist, or promotes an existing account to `admin`. Admins can access `/admin`.

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deployment (Vercel)

1. Push this repository to GitHub (see below).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel project settings (Production + Preview).
4. Deploy. `vercel.json` already configures a cron job that hits `/api/cron/check-alerts` every 15 minutes — Vercel Cron picks this up automatically on a Pro plan (Hobby plans support daily crons only; adjust the schedule if needed).
5. Run the admin seed script once against your production database (or a one-off Vercel CLI invocation) to create your first admin.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: WeatherSphere Pro"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Architecture notes

- **Weather provider fallback**: `lib/weather.ts` always tries Open-Meteo first (no API key, generous limits). If that fails and `OPENWEATHER_API_KEY` is set, it transparently retries against OpenWeatherMap with the same output shape, so nothing downstream needs to know which provider answered.
- **Caching**: weather and geocode requests set `next: { revalidate: 300 }` (5 minutes), matching the dashboard's auto-refresh interval, so concurrent users requesting the same city don't multiply upstream calls.
- **Auth**: JWTs are signed server-side and stored in an httpOnly, sameSite cookie — never exposed to client JS. `middleware.ts` does a fast cookie-presence check on the Edge runtime; full signature verification happens in `getSession()` on Node, which is what actually gates data access.
- **Historical data**: every weather fetch on the dashboard also POSTs a lightweight snapshot to `/api/history`, which is how the trend charts accumulate data without a separate polling worker.
- **Smart alerts**: alerts are evaluated by `lib/alerts.ts`, invoked on a schedule via `/api/cron/check-alerts` (protected by `CRON_SECRET`). It groups alerts by location to avoid redundant weather calls, and is intentionally decoupled from notification delivery — wire in email/push/webhook at the marked `TODO`.
- **AI summary**: `lib/summary.ts` generates natural-language summaries with a local rule-based engine today. `generateSummaryWithLLM()` is the documented swap-in point for OpenAI/Gemini/Claude — the input/output contract won't change when you wire in a real model.
- **White-label branding**: stored per-user in `User.branding` (logo, color, font, radius, theme), applied to the dashboard shell, the branding preview, and passed as `data-*` attributes into the embeddable widget script.
- **Rate limiting**: `lib/rateLimit.ts` is a fixed-window in-memory limiter — fine for a single instance, documented to swap for Upstash Redis in a real multi-instance deployment.

## API reference (selected)

| Route | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Create an account, sets session cookie |
| `/api/auth/login` | POST | Authenticate, sets session cookie |
| `/api/auth/logout` | POST | Clears session cookie |
| `/api/auth/me` | GET | Current session user |
| `/api/weather` | GET | `?lat&lon&name&timezone` → full weather snapshot |
| `/api/geocode` | GET | `?q=` city search, or `?lat&lon` reverse geocode |
| `/api/history` | GET/POST | Read/write historical weather snapshots for trend charts |
| `/api/alerts` | GET/POST | List/create smart alerts for the current user |
| `/api/cron/check-alerts` | GET | Scheduled alert evaluation (bearer `CRON_SECRET`) |
| `/api/user/branding` | GET/PUT | Read/update white-label branding settings |
| `/api/user/favorites` | GET/POST | Manage saved cities |
| `/api/admin/stats` | GET | Platform analytics (admin only) |
| `/api/admin/users` | GET/PATCH | User management (admin only) |

## Roadmap

- Real LLM-backed weather summaries (OpenAI/Gemini/Claude) via `generateSummaryWithLLM`
- Email/push/webhook delivery for triggered alerts
- Air Quality Index data source for AQI alerts (Open-Meteo Air Quality API)
- Stripe billing for Pro / White Label plans
- Multi-seat teams under a single white-label account
- Redis-backed rate limiting and distributed caching for multi-instance deployments
- Automated tests (Vitest/Playwright) and CI

## License

Proprietary — built for commercial use. Adapt freely for client or SaaS deployment.
