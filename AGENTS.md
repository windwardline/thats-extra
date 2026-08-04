# That's Extra — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. That's Extra is a change-order capture and margin-recovery demo for electrical and HVAC subcontractors — landing, live demo, workflow, proposal and contract templates. Live at thats-extra.windwardline.com.

## Stack — do not substitute without flagging

Next.js ^16.2.12 + React 19.2.8, Tailwind v4, zod, the openai SDK pointed at Groq. Vitest. Security `overrides` pinned in `package.json`.

## Commands

`npm run dev` · `npm test` · `npm run lint` · `npm run typecheck` · `npm run build`

## Gates — CI in order

`npm ci` → lint → typecheck → test → build. Push to main deploys production.

## Laws

- Navigation has one source of truth: `src/lib/nav.ts`. Header and footer both read it; a new route is added there and nowhere else.
- `/api/generate` never 500s: 400 only on zod failure; Groq errors fall through to the deterministic sample generator (`source: "sample"`). Keep `src/lib/generator.ts` pure — no clock, no randomness, no network. Tests assert determinism.
- Groq config lives in `src/lib/groq.ts`: `GROQ_API_KEY` gates the live path; defaults are `llama-3.3-70b-versatile`, 15 s timeout, retries off. `ZAPIER_WEBHOOK_URL` is a no-op when unset (`src/lib/zapier.ts`).
- Vitest collects only `src/**/*.test.ts` in a node environment — a `.tsx` component test is silently ignored. Extend `vitest.config.ts` before writing one.
- Security headers are platform-applied from `vercel.json` — the house seven-header set, CSP on craft's Next.js shape. The demo form is JS-handled (`onSubmit` + fetch to `/api/generate` under `connect-src 'self'`), so `form-action 'none'` holds; `src/lib/security-headers.test.ts` enforces the set. After a deploy, verify live: `curl -sI https://thats-extra.windwardline.com`.
- Zapier/Resend/DMARC runbook: `docs/zapier/zap-setup.md`. Demo walkthrough: `docs/demo-script.md`.
