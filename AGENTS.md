# That's Extra — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. Work here follows the CONVERGE cycle and delivery discipline in `FLEET.md` (windwardline/windwardline) — find → refute → verify yourself → fix → re-rank → test → update → report; enumerate the gates rather than counting them, stage explicit paths, validate before mutating, preserve standing claims, derive populations rather than curating them, and never let a harness failure read as the subject refusing. `FLEET.md` governs where it and this summary differ. That's Extra is a change-order capture and margin-recovery demo for electrical and HVAC subcontractors — landing, live demo, workflow, proposal and contract templates. Live at thats-extra.windwardline.com.

## Stack — do not substitute without flagging

Next.js ^16.2.12 + React 19.2.8, Tailwind v4, zod, the openai SDK pointed at Groq. Vitest. Security `overrides` pinned in `package.json`.

## Commands

`npm run dev` · `npm test` · `npm run lint` · `npm run typecheck` · `npm run build`

## Gates — CI in order

`ci.yml` runs `npm ci` → lint → typecheck → test → build as one `build` job on every push and pull request to main: Node 24 with the npm cache, a 15-minute timeout, read-only `contents`, and in-progress runs cancelled per ref. Push to main deploys production. `security.yml` runs Semgrep and Secret scan on PRs, pushes, and the weekly cron; Dependency scan on PRs, pushes, and both the weekly and daily crons; and Headers live after pushes and on both crons, never on PRs. The required `Secret scan` check also executes the pinned `verify-action-pins` step, so a mutable third-party `uses:` ref or a SHA/tag-comment mismatch blocks under `Secret scan`.

`claude-review.yml` runs an advisory review on every eligible same-repo PR event when `github.actor` — the original event actor — is not `dependabot[bot]`. It deliberately calls the fleet reusable at `@main`, so one merge updates every repo. The review activates only with `CLAUDE_CODE_OAUTH_TOKEN`; fork and missing-secret events skip. Reviews bill the owner's Claude subscription, not Console credits.

`dependabot-auto-merge.yml` is byte-identical fleet-wide. It merges nothing itself; on a same-repo Dependabot PR it arms GitHub's native auto-merge, leaving the zero-bypass branch ruleset as the merge gate. It holds for a human when `allow_auto_merge` is off or the base branch has no required check, when `no-automerge` is set, when a release changed maintainers, on a 0.x minor or 0.0.x patch, when Dependabot metadata is empty or unverifiable, when the update type is unrecognised, and on a major bump. The empty-or-unverifiable metadata hold and the unrecognised-update-type hold are distinct. A merge-gate hold can occur before the lane reaches deferred-major labeling. Every hold withdraws any auto-merge armed earlier. Patch and minor bumps on ≥1.0 packages are what it arms.

Dependabot groups npm production dependencies as `production-dependencies`, npm development dependencies as `development-dependencies`, and GitHub Actions as `github-actions`. `fetch-metadata` reports the highest semver change across the entire grouped PR; one held member holds the group, and arm/hold is per grouped PR rather than per dependency. The lane mints a GitHub App token from the `FLEET_AUTOMERGE_APP_ID` and `FLEET_AUTOMERGE_PRIVATE_KEY` Dependabot secrets. Actions secrets read as empty in a Dependabot-triggered run; absent Dependabot secrets degrade to `GITHUB_TOKEN`, whose merge creates no push workflow. The run summary names the credential used. The job carries no `name:`, so the check renders exactly `dependabot-auto-merge`; it must never become a required check.

## Laws

- Navigation has one source of truth: `src/lib/nav.ts`. Header and footer both read it; a new route is added there and nowhere else.
- `/api/generate` never 500s: 400 only on zod failure; Groq errors fall through to the deterministic sample generator (`source: "sample"`). Keep `src/lib/generator.ts` pure — no clock, no randomness, no network. Tests assert determinism.
- Groq config lives in `src/lib/groq.ts`: `GROQ_API_KEY` gates the live path; defaults are `llama-3.3-70b-versatile`, 15 s timeout, retries off. `ZAPIER_WEBHOOK_URL` is a no-op when unset (`src/lib/zapier.ts`).
- Vitest collects only `src/**/*.test.ts` in a node environment — a `.tsx` component test is silently ignored. Extend `vitest.config.ts` before writing one.
- Security headers are platform-applied from `vercel.json` — the house seven-header set, CSP on craft's Next.js shape. The demo form is JS-handled (`onSubmit` + fetch to `/api/generate` under `connect-src 'self'`), so `form-action 'none'` holds; `src/lib/security-headers.test.ts` enforces the set. After a deploy, verify live: `curl -sI https://thats-extra.windwardline.com`.
- Zapier/Resend/DMARC runbook: `docs/zapier/zap-setup.md`. Demo walkthrough: `docs/demo-script.md`.
