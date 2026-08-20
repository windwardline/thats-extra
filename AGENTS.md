# That's Extra — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. Work here follows the CONVERGE cycle and delivery discipline in `FLEET.md` (windwardline/windwardline) — find → refute → verify yourself → fix → re-rank → test → update → report; enumerate the gates rather than counting them, stage explicit paths, validate before mutating, preserve standing claims, derive populations rather than curating them, and never let a harness failure read as the subject refusing. `FLEET.md` governs where it and this summary differ. That's Extra is a change-order capture and margin-recovery demo for electrical and HVAC subcontractors — landing, live demo, workflow, proposal and contract templates. Live at thats-extra.windwardline.com.

## Stack — do not substitute without flagging

Next.js ^16.2.12 + React 19.2.8, Tailwind v4, zod, the openai SDK pointed at Groq. Vitest. Security `overrides` pinned in `package.json`.

## Commands

`npm run dev` · `npm test` · `npm run lint` · `npm run typecheck` · `npm run build`

## Gates — CI in order

`ci.yml` runs `npm ci` → lint → typecheck → test → build as one `build` job on every push and pull request to main — Node 24 with the npm cache, a 15-minute timeout, read-only `contents`, and in-progress runs cancelled per ref. Push to main deploys production. A parallel `security.yml` (PRs, pushes, weekly cron; a daily cron runs only the production headers probe) gates Semgrep, secret scan, and dependency scan; a post-deploy job asserts the production security headers. An advisory Claude review runs on every same-repo PR via `claude-review.yml`, which deliberately calls the fleet reusable at `@main` — one merge updates every repo. It activates only when the `CLAUDE_CODE_OAUTH_TOKEN` secret is present — reviews bill the owner's Claude subscription, not Console credits; fork PRs never receive secrets, so they skip it by security design.

`dependabot-auto-merge.yml` merges nothing itself. On a Dependabot-authored PR from a branch in this repo it arms GitHub's native auto-merge, so the branch ruleset — zero bypass actors — stays the only thing that decides whether a merge happens; a bug there cannot merge red CI, only fail to arm. It holds for a human, and withdraws any auto-merge an earlier run armed, when the repo offers no gate to ride (`allow_auto_merge` off, or no required status checks on the base branch — arming would merge immediately), when the `no-automerge` label is set, when the release changed maintainers, on a pre-1.0 package whose bump is labelled minor — Dependabot labels by literal position, so 0.9.1 → 0.10.0 arrives as "minor" — or is a 0.0.x patch, on unverifiable Dependabot metadata, and on a major, which it labels `deferred-major` before holding. Patch and minor bumps on ≥1.0 packages are what it arms. It mints a GitHub App token from the `FLEET_AUTOMERGE_APP_ID` / `FLEET_AUTOMERGE_PRIVATE_KEY` Dependabot secrets — Dependabot secrets, not Actions secrets, which a Dependabot-triggered run reads as empty rather than erroring — and degrades to `GITHUB_TOKEN` when they are absent. A push attributed to `GITHUB_TOKEN` creates no workflow run at all, so on the fallback path an auto-merged commit fires none of `security.yml`'s push jobs, the `Headers live` probe included; the run summary names which credential was used. The job carries no `name:` so the check renders exactly `dependabot-auto-merge`, the string the fleet conformance audit excludes — it must never become a required check. The file is byte-identical in every fleet repo that takes it, which is why it names no repo.

## Laws

- Navigation has one source of truth: `src/lib/nav.ts`. Header and footer both read it; a new route is added there and nowhere else.
- `/api/generate` never 500s: 400 only on zod failure; Groq errors fall through to the deterministic sample generator (`source: "sample"`). Keep `src/lib/generator.ts` pure — no clock, no randomness, no network. Tests assert determinism.
- Groq config lives in `src/lib/groq.ts`: `GROQ_API_KEY` gates the live path; defaults are `llama-3.3-70b-versatile`, 15 s timeout, retries off. `ZAPIER_WEBHOOK_URL` is a no-op when unset (`src/lib/zapier.ts`).
- Vitest collects only `src/**/*.test.ts` in a node environment — a `.tsx` component test is silently ignored. Extend `vitest.config.ts` before writing one.
- Security headers are platform-applied from `vercel.json` — the house seven-header set, CSP on craft's Next.js shape. The demo form is JS-handled (`onSubmit` + fetch to `/api/generate` under `connect-src 'self'`), so `form-action 'none'` holds; `src/lib/security-headers.test.ts` enforces the set. After a deploy, verify live: `curl -sI https://thats-extra.windwardline.com`.
- Zapier/Resend/DMARC runbook: `docs/zapier/zap-setup.md`. Demo walkthrough: `docs/demo-script.md`.
