# That's Extra

**Every "Can You Just..." Has a Price.**

That's Extra is an AI-powered margin recovery platform for commercial electrical and HVAC
subcontractors. Field crews capture extra-work evidence in a two-minute report; a Zapier +
Groq automation turns it into a professional change request emailed to the PM and stored
for reporting — before extra work becomes free work. This repo is the presentation-ready
SaaS web app: landing page, live demo, automation documentation, and the written
deliverables (proposal + contract templates).

## Architecture

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, problem, solution, workflow, live sample output, benefits |
| `/demo` | Field report form → generated change request package (`?sample=1` prefills the Midtown scenario) |
| `/workflow` | The Zapier automation explained step by step, with credential placeholders |
| `/proposal` | Consulting proposal template (screen + print-to-PDF) |
| `/contract` | Professional services agreement template (screen + print-to-PDF) |
| `POST /api/generate` | Change request generation — Groq with deterministic fallback |

**Generation flow:**

```
Form (zod-validated) → POST /api/generate
                          ├─ invalid body ──────────────→ 400
                          ├─ GROQ_API_KEY set?
                          │    ├─ yes → Groq (15s timeout, JSON schema-validated)
                          │    │          ├─ ok ────────→ 200 { source: "groq", pkg }
                          │    │          └─ any error ─→ falls through ↓
                          │    └─ no ─────────────────────↓
                          └─ deterministic generator ───→ 200 { source: "sample", pkg }
```

**The demo cannot fail.** The fallback generator (`src/lib/generator.ts`) is pure and
deterministic — it builds a realistic, trade-aware package from the actual form inputs with
no network, no clock, no randomness. The UI reports the source honestly: an amber **Live AI**
badge or a neutral **Sample Mode** badge. Stack: Next.js (App Router), TypeScript, Tailwind
CSS v4, zod, Vitest.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — the app runs fully without it
npm run dev                  # http://localhost:3000
```

Set `GROQ_API_KEY` in `.env.local` to enable live AI generation. Without it, the demo
runs in Sample Mode.

## Testing

```bash
npm test           # Vitest — schemas, generator, API fallback behavior
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # production build
```

Unit tests cover the real logic: the shared zod schemas, the deterministic generator
(schema-validity, determinism, fact-weaving, trade-awareness), and all four `/api/generate`
paths (invalid body, no key, key + success, key + failure → fallback). Presentational pages
are verified by typecheck + lint + build + browser checks.

## Deployment (Vercel)

**Option A — GitHub import (recommended):** push this repo to GitHub, then in the Vercel
dashboard: *Add New → Project → Import* the repo. Next.js is auto-detected. Optionally add
`GROQ_API_KEY` under *Settings → Environment Variables*. Deploy.

**Option B — CLI:**

```bash
npx vercel login
npx vercel --prod
```

No other configuration is required — there is no database and no server state.

## Presentation notes (Monday run-of-show)

1. **Open `/` (~2 min).** Narrate the problem, not the product: read the "can you just"
   quotes, walk the cost chain, land on the kicker. Scroll through the workflow strip —
   it's the 30-second version of the pitch.
2. **Open `/workflow` (~2 min).** The automation story: one Zap, six steps. Point at the
   amber credential chips — "everywhere you see one of these is a key you'd plug in on
   day one." Close on the note that the app's own API mirrors step 3.
3. **Open `/demo?sample=1` and generate live (~2 min).** The form arrives pre-filled with
   the Midtown scenario. Hit Generate, let the package render, scroll the output slowly —
   this is the money shot. Show the copy buttons and Print / Save PDF.
4. **Show `/proposal` and `/contract` (~1 min each).** The written deliverables. Hit
   Print / Save PDF on one of them to show they produce clean client-ready documents.

**If the Wi-Fi dies:** nothing changes. The demo falls back to Sample Mode automatically —
and that's a *feature*, not an apology. Sell it as one: "a field tool that fails on a
jobsite with bad signal is a field tool nobody uses. This one degrades gracefully, and it
tells you the truth about which mode it's in."
