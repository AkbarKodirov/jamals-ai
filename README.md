# Jamals AI

The exam platform of **Jamals International Academy** (Tashkent, since 2020): Digital SAT and IELTS practice with **Humo**, a golden 3D AI tutor.

## What's inside

| Route | What it is |
|---|---|
| `/` | Landing page with a real-time 3D Humo (Three.js / React Three Fiber), live "try a question" demo, features, pricing, FAQ |
| `/login`, `/signup` | Google sign-in + email auth, 3D Humo on the side |
| `/privacy`, `/terms` | Privacy Policy and Terms of Service (needed for Google publishing) |
| `/app` | Light dashboard: score goal, exam countdown, streak, analytics, today's plan |
| `/app/tests` | 10 original practice tests (476 questions, from Shakhna Academy's originals) as cards → Exam / Practice / Sprint mode |
| `/app/tests/:id/take` | Full-screen Bluebook-style runner: module timer, mark for review, answer eliminator, navigator, keyboard A–D/arrows |
| `/app/results/:id` | Estimated score, answer map, review with **Humo's explanation above every question**, Ask Humo drawer with the test as context |
| `/app/vocab` | 120 SAT words in 3 levels: Daily 20, 4-type quiz with combos, flip flashcards with spaced repetition |
| `/app/blitz`, `/app/mistakes` | Speed mode (lives, streak multiplier, best score); mistakes notebook that clears when you get it right |

Brand follows [jamals.uz](https://jamals.uz): ink `#0a0f0e`, pine `#1b2925`, green `#48ae4f` / `#62b968`, cream `#faf7f1`, Literata + Onest. Tokens live in `src/index.css`.

## Run locally

```bash
npm install
cp .env.example .env          # server settings
cp .env.example .env.local    # frontend settings (only VITE_* is used)
npm run dev:all               # web on :5173, API on :3001
```

`npm run dev` runs the frontend alone — everything still works in demo mode (Google button opens a demo account, Humo shows an offline notice).

## Google sign-in

Already configured: the public OAuth client ID is committed in `.env.development` / `.env.production` and used by the server as a fallback.

- While the Google consent screen is in **Testing**, only accounts added under Google Auth Platform → Audience → Test users can sign in.
- To open sign-in to everyone: deploy, add the production domain to the client's **Authorized JavaScript origins**, then click **Publish app** (links to `/privacy` and `/terms` are ready for the consent screen).

Flow: the browser gets a Google access token → `POST /api/auth/google` → the server checks the token belongs to our client ID, reads the verified profile, and returns a 30-day JWT.

## Turn on live Humo

Set `GEMINI_API_KEY` (free at aistudio.google.com; optionally `GEMINI_MODEL`) in `.env`, then restart the API. Per-question explanations are generated once and cached in `server/data/explanations.json`, so every later student gets them instantly and at no cost. Humo's persona is in `server/index.js` (`HUMO_SYSTEM`).

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
