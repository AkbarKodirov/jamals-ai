# Jamals AI

The exam platform of **Jamals International Academy** (Tashkent, since 2020): Digital SAT and IELTS practice with **Humo**, a golden 3D AI tutor.

## What's inside

| Route | What it is |
|---|---|
| `/` | Landing page with a real-time 3D Humo (Three.js / React Three Fiber), live "try a question" demo, features, pricing, FAQ |
| `/login`, `/signup` | Google sign-in + email auth, 3D Humo on the side |
| `/app` | Dashboard, Humo chat (Gemini), question bank with filters, timed mock test with flags and section navigation |

Brand follows [jamals.uz](https://jamals.uz): ink `#0a0f0e`, pine `#1b2925`, green `#48ae4f` / `#62b968`, cream `#faf7f1`, Literata + Onest. Tokens live in `src/index.css`.

## Run locally

```bash
npm install
cp .env.example .env          # server settings
cp .env.example .env.local    # frontend settings (only VITE_* is used)
npm run dev:all               # web on :5173, API on :3001
```

`npm run dev` runs the frontend alone — everything still works in demo mode (Google button opens a demo account, Humo shows an offline notice).

## Turn on real Google sign-in

1. Google Cloud Console → APIs & Services → Credentials → **Create OAuth client ID** → Web application.
2. Authorized JavaScript origins: `http://localhost:5173` and your production domain.
3. Put the client ID in `VITE_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (server).

Flow: the browser gets a Google access token → `POST /api/auth/google` → the server checks the token belongs to our client ID, reads the verified profile, and returns a 30-day JWT.

## Turn on live Humo

Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in `.env`, then restart the API. Humo's persona is in `server/index.js` (`HUMO_SYSTEM`).

## Before production

- Set a long random `JWT_SECRET`.
- Replace the JSON user store (`server/data/users.json`) with Postgres.
- Require auth + rate-limit `/api/chat`.
- Pricing, FAQ and university list are plain arrays in `src/landing/Sections.tsx`.

## Structure

```
src/
  three/      HumoBird.tsx (procedural 3D bird), HumoScene.tsx (lights, halo, bloom, scroll rig)
  landing/    Landing, TryHumo, Features, Sections
  auth/       AuthPage, GoogleButton
  app/        AppShell (dashboard, Humo chat, practice, mock)
  lib/auth.tsx
server/index.js   Express: Google auth, email auth, JWT, Gemini chat
```

SAT® is a trademark of the College Board; IELTS™ is owned by the British Council, IDP and Cambridge University Press & Assessment. Neither endorses this product.
