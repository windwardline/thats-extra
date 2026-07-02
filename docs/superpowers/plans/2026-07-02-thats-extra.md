# That's Extra Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a presentation-ready SaaS web app ("That's Extra") — landing page, AI demo, Zapier workflow docs, proposal and contract templates — deployable on Vercel.

**Architecture:** Next.js 15 App Router site with five routes and one API route. All real logic (zod schemas, deterministic fallback generator, OpenAI-with-fallback API route) is TDD'd with Vitest; presentational pages are verified via typecheck + lint + build + browser. No database.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, zod, openai SDK, lucide-react, Vitest.

## Global Constraints

- Product name **"That's Extra"**; tagline **Every "Can You Just..." Has a Price.**
- Hero headline verbatim: **Every "Can You Just..." Should Come With a Change Order.**
- Brand voice: Basecamp × Morning Brew × Liquid Death; jokes from shared jobsite experience, never mocking contractors.
- Premium B2B SaaS aesthetic: charcoal/near-black base, safety-amber accent, NOT stereotypical construction clip-art.
- All work on branch `feat/thats-extra-app` off `main`; Conventional Commits; no co-author trailer.
- Placeholders wherever real credentials would be needed (OpenAI, Zapier, Google, Supabase).
- Gate for done: `npm run typecheck` + `npm run lint` + `npm test` + `npm run build` all pass, every route verified in browser at desktop and mobile widths.
- Demo must never fail: API route falls back to deterministic sample on missing key or any error; response carries `source: "openai" | "sample"` and the UI shows an honest "Live AI" / "Sample Mode" badge.

---

### Task 1: Scaffold app + test tooling

**Files:**
- Create: entire Next.js scaffold at repo root (`package.json`, `src/app/*`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`)
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts: `test`, `typecheck`)

**Interfaces:**
- Produces: working `npm run dev|build|lint|typecheck` and `npm test` commands; `@/*` path alias to `src/*`.

- [ ] **Step 1: Create feature branch**

```bash
cd /Users/peacock/Projects/thats-extra && git switch -c feat/thats-extra-app
```

- [ ] **Step 2: Scaffold Next.js in-place**

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --no-git --yes
```

Note: scaffolding into a non-empty dir (docs/ exists) — if create-next-app refuses, scaffold into a temp dir and move contents in, preserving `docs/` and `.git/`.

- [ ] **Step 3: Install runtime + test deps**

```bash
npm i zod openai lucide-react && npm i -D vitest vite-tsconfig-paths
```

- [ ] **Step 4: Add vitest config + scripts**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
```

`package.json` scripts: add `"test": "vitest run"`, `"typecheck": "tsc --noEmit"`.

- [ ] **Step 5: Verify all commands pass on the clean scaffold**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all pass (no tests yet — `npm test` may report "no test files"; acceptable until Task 2).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js 15 app with Tailwind v4 and Vitest"
```

---

### Task 2: Shared schemas + sample scenario (TDD)

**Files:**
- Create: `src/lib/schema.ts`, `src/lib/sample-scenario.ts`
- Test: `src/lib/schema.test.ts`

**Interfaces:**
- Produces:
  - `fieldReportSchema` (zod) and `type FieldReport` with fields: `companyName, projectName, submittedBy, trade ("Electrical"|"HVAC"), changeType ("GC / Owner Request"|"Design Revision"|"Concealed Condition"|"Code Requirement"|"Other Trade Conflict"), description, laborImpact, materialImpact, scheduleImpact, urgency ("Low"|"Medium"|"High"|"Critical"), requestedNextStep, pmEmail` — all strings, `description` min 10 chars, `pmEmail` must be an email.
  - `changeRequestPackageSchema` and `type ChangeRequestPackage` with fields: `title, executiveSummary, existingCondition, requestedChange, laborImpact, materialImpact, scheduleImpact, recommendedNextStep, customerFacingRequest, emailDraft` (all non-empty strings).
  - `type GenerateResponse = { source: "openai" | "sample"; pkg: ChangeRequestPackage }`.
  - `MIDTOWN_SCENARIO: FieldReport` — the fictional Midtown Office Renovation electrical scenario (12 fixtures relocated after rough-in per revised RCP; two electricians, six labor hours, lift rental, wire, connectors, testing & commissioning; urgency High; changeType "GC / Owner Request"; pmEmail `pm@meridianelectric.example`; companyName "Meridian Electric Co."; submittedBy "Dave Kowalski, Foreman").

- [ ] **Step 1: Write failing tests** (`src/lib/schema.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { fieldReportSchema } from "@/lib/schema";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";

describe("fieldReportSchema", () => {
  it("accepts the Midtown sample scenario", () => {
    expect(fieldReportSchema.safeParse(MIDTOWN_SCENARIO).success).toBe(true);
  });
  it("rejects a bad email and short description", () => {
    const bad = { ...MIDTOWN_SCENARIO, pmEmail: "not-an-email", description: "short" };
    const result = fieldReportSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("pmEmail");
      expect(paths).toContain("description");
    }
  });
  it("rejects an unknown trade", () => {
    expect(fieldReportSchema.safeParse({ ...MIDTOWN_SCENARIO, trade: "Plumbing" }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npm test` → FAIL (module not found).

- [ ] **Step 3: Implement `schema.ts` + `sample-scenario.ts`** matching the Interfaces block exactly. Midtown description text: "GC issued revised reflected ceiling plan (RCP-4, Rev C) after our rough-in was complete. Twelve 2x4 LED troffers in the open office area must be relocated an average of 6 feet to align with the new ceiling grid layout. Whips, supports, and circuiting all shift."

- [ ] **Step 4: Run tests** — `npm test` → PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat: add field report and change request schemas with sample scenario"`

---

### Task 3: Deterministic fallback generator (TDD)

**Files:**
- Create: `src/lib/generator.ts`
- Test: `src/lib/generator.test.ts`

**Interfaces:**
- Consumes: `FieldReport`, `ChangeRequestPackage`, `changeRequestPackageSchema` from Task 2.
- Produces: `generateSamplePackage(report: FieldReport): ChangeRequestPackage` — pure, deterministic, trade-aware (mentions "electrical"/"electricians" vs "mechanical"/"sheet metal" wording), incorporates the report's actual company, project, impacts, urgency, and next step into every relevant section; `emailDraft` addresses the PM and is signed by `submittedBy`; `customerFacingRequest` is a formal multi-paragraph change request suitable to forward to a GC.

- [ ] **Step 1: Write failing tests** (`src/lib/generator.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { generateSamplePackage } from "@/lib/generator";
import { changeRequestPackageSchema } from "@/lib/schema";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";

describe("generateSamplePackage", () => {
  const pkg = generateSamplePackage(MIDTOWN_SCENARIO);

  it("produces a package that satisfies the schema", () => {
    expect(changeRequestPackageSchema.safeParse(pkg).success).toBe(true);
  });
  it("is deterministic", () => {
    expect(generateSamplePackage(MIDTOWN_SCENARIO)).toEqual(pkg);
  });
  it("weaves the report facts into the output", () => {
    expect(pkg.title).toContain(MIDTOWN_SCENARIO.projectName);
    expect(pkg.executiveSummary).toContain(MIDTOWN_SCENARIO.companyName);
    expect(pkg.laborImpact).toContain("Two electricians");
    expect(pkg.emailDraft).toContain(MIDTOWN_SCENARIO.submittedBy.split(",")[0]);
  });
  it("adapts wording to HVAC trade", () => {
    const hvac = generateSamplePackage({ ...MIDTOWN_SCENARIO, trade: "HVAC" });
    expect(hvac.customerFacingRequest.toLowerCase()).toContain("mechanical");
  });
});
```

- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement** — template functions per section; trade lookup table `{ Electrical: {...}, HVAC: {...} }` for crew nouns/scope nouns; urgency maps to response-window sentence ("Critical" → 24 hours … "Low" → next scheduled progress meeting). No randomness, no dates from `Date.now()` (use "upon approval" phrasing) so output is pure.
- [ ] **Step 4: Run tests** → PASS. **Step 5: Commit** — `git commit -m "feat: add deterministic change request generator"`

---

### Task 4: `/api/generate` route with OpenAI + fallback (TDD)

**Files:**
- Create: `src/lib/openai.ts`, `src/app/api/generate/route.ts`
- Test: `src/lib/generate-handler.test.ts`, plus create `src/lib/generate-handler.ts` (framework-free handler so the logic is testable without Next request mocking)

**Interfaces:**
- Consumes: `fieldReportSchema`, `generateSamplePackage`, `ChangeRequestPackage`.
- Produces:
  - `generateWithOpenAI(report: FieldReport): Promise<ChangeRequestPackage>` in `openai.ts` — throws if no `OPENAI_API_KEY`; uses `openai` SDK chat completions with `response_format: { type: "json_object" }`, model `gpt-4o-mini`, 15s timeout, result validated by `changeRequestPackageSchema.parse`.
  - `handleGenerate(body: unknown, deps?: { generate?: typeof generateWithOpenAI }): Promise<{ status: number; json: GenerateResponse | { error: string } }>` in `generate-handler.ts`:
    - invalid body → `{ status: 400, json: { error } }`
    - no `OPENAI_API_KEY` env → `{ status: 200, json: { source: "sample", pkg } }`
    - key set, `deps.generate` resolves → `{ status: 200, json: { source: "openai", pkg } }`
    - key set, `deps.generate` rejects → falls back to `{ source: "sample" }` (still 200)
  - `route.ts` is a thin wrapper: `export async function POST(req: Request) { const r = await handleGenerate(await req.json().catch(() => null)); return Response.json(r.json, { status: r.status }); }`

- [ ] **Step 1: Write failing tests** (`src/lib/generate-handler.test.ts`)

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { handleGenerate } from "@/lib/generate-handler";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";
import { generateSamplePackage } from "@/lib/generator";

afterEach(() => vi.unstubAllEnvs());

describe("handleGenerate", () => {
  it("400s on an invalid body", async () => {
    const r = await handleGenerate({ nope: true });
    expect(r.status).toBe(400);
  });
  it("uses sample source when no API key is set", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const r = await handleGenerate(MIDTOWN_SCENARIO);
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ source: "sample" });
  });
  it("uses openai source when key is set and the call succeeds", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const fake = generateSamplePackage(MIDTOWN_SCENARIO);
    const r = await handleGenerate(MIDTOWN_SCENARIO, { generate: vi.fn().mockResolvedValue(fake) });
    expect(r.json).toMatchObject({ source: "openai" });
  });
  it("falls back to sample when the OpenAI call fails", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const r = await handleGenerate(MIDTOWN_SCENARIO, { generate: vi.fn().mockRejectedValue(new Error("boom")) });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ source: "sample" });
  });
});
```

- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement** `generate-handler.ts`, `openai.ts` (prompt instructs: professional construction change-request writer; return JSON with exactly the ten package keys; keep dollar amounts out unless provided), and thin `route.ts`. Fallback path logs `console.warn("generate: falling back to sample:", err)` — no silent swallow.
- [ ] **Step 4: Run full suite** — `npm test` → PASS; `npm run typecheck` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: add generate API route with OpenAI and deterministic fallback"`

---

### Task 5: Design system foundation (theme, fonts, shared UI, nav)

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/ui.tsx` (Container, Button, Badge, Card, SectionHeading), `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/reveal.tsx`, `src/app/icon.svg`

**Interfaces:**
- Produces: Tailwind v4 `@theme` tokens — `--color-ink` (#0B0E13 near-black), `--color-surface` (#11151C), `--color-line` (#232A35), `--color-amber` (#F5A524 safety-amber), `--color-paper` (#F7F5F0 warm off-white for docs); display font **Sora**, body font **Inter** via `next/font/google` (variables `--font-display`, `--font-body`). Components: `Container` (max-w-6xl px-6), `Button({ href, variant: "primary" | "ghost" })`, `Badge({ tone })`, `Card`, `SectionHeading({ eyebrow, title, lede })`, `Reveal` (client component: IntersectionObserver adds `is-visible`, CSS handles translate/opacity transition, honors `prefers-reduced-motion`).
- Header nav: Product (`/`), Demo (`/demo`), How It Works (`/workflow`), Proposal (`/proposal`), Contract (`/contract`); logo wordmark "THAT'S EXTRA." with amber period. Footer: tagline, nav links, "Built for the trades. © 2026 That's Extra."

- [ ] **Step 1: Implement theme + fonts + layout metadata** (title: "That's Extra — Every 'Can You Just…' Has a Price."; description from spec value prop).
- [ ] **Step 2: Implement shared components and header/footer**, replace scaffold home page with a placeholder that uses them.
- [ ] **Step 3: Verify** — `npm run lint && npm run typecheck && npm run build` pass; view in browser: header, footer, fonts, colors correct at 375px and 1440px.
- [ ] **Step 4: Commit** — `git commit -m "feat: add design system, theme, and site chrome"`

---

### Task 6: Landing page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/workflow-diagram.tsx`, `src/components/sample-output.tsx` (renders a `ChangeRequestPackage` — reused by `/demo`)

**Interfaces:**
- Consumes: UI kit (Task 5), `MIDTOWN_SCENARIO` + `generateSamplePackage` (server-side, to render the demo scenario section from real generator output).
- Produces: `WorkflowDiagram({ steps, orientation })` (also used on `/workflow`); `SampleOutput({ pkg, source })` (also used on `/demo`).

Sections and normative copy (voice: wry, on the contractor's side):

1. **Hero** — eyebrow: "MARGIN RECOVERY FOR SPECIALTY TRADES". H1 verbatim from Global Constraints. Sub: verbatim from brief. CTAs: "Demo the Workflow" → `/demo`; "Generate a Sample Change Request" → `/demo?sample=1`. Right/below: `WorkflowDiagram` with steps Foreman → Photos + Notes → Zapier Automation → AI → Professional Change Request → Project Manager → Recovered Revenue.
2. **Problem** — title "The Most Expensive Words on a Jobsite." Quote chips: "Can you just move those outlets?" / "Can you just shift this duct?" / "Can you just add one more receptacle?" / "While you're here…". Cost-chain list: Nobody writes it down. / The photos live and die on the foreman's phone. / The labor hours evaporate from memory by Friday. / The material came off the truck, so it must have been free. / The PM reconstructs the whole thing three days later from a text thread. / The change request becomes an afterthought. / Extra work quietly becomes free work. Kicker: "You did the work. You bought the material. You even stayed late. The only thing you didn't do was get paid."
3. **Solution** — "From 'can you just' to 'sign right here.'" Six numbered steps per spec.
4. **Automation strip** — horizontal `WorkflowDiagram`: Field Report → Zapier → AI Processing → Professional Change Request → Email Project Manager → Stored Record; caption "Thirty seconds to understand. Ninety seconds to run."
5. **Demo scenario** — "One revised ceiling plan. Twelve relocated fixtures. Zero lost dollars." Renders scenario facts + `SampleOutput` from the real generator, link "Run it yourself →" to `/demo?sample=1`.
6. **Benefits** — six cards (lucide icons): Recover lost revenue / Cut PM admin time / Field docs that hold up / Same-day response / Customers trust paper, not memory / Margins that survive the punch list — each with 1–2 sentence copy.
7. **CTA footer band** — "The next 'can you just…' is coming. Be ready for it." + both CTAs.

- [ ] **Step 1: Build `WorkflowDiagram` and `SampleOutput`.**
- [ ] **Step 2: Build the page with all seven sections and copy above.**
- [ ] **Step 3: Verify** — lint/typecheck/build pass; browser check desktop + 375px; reveal animations subtle; contrast accessible.
- [ ] **Step 4: Commit** — `git commit -m "feat: add landing page"`

---

### Task 7: Demo page (form → generated package)

**Files:**
- Create: `src/app/demo/page.tsx` (server shell), `src/components/demo-form.tsx` (client)

**Interfaces:**
- Consumes: `fieldReportSchema`, `MIDTOWN_SCENARIO`, `SampleOutput`, `GenerateResponse`.
- Behavior: all 12 fields (selects for trade/changeType/urgency, textareas for description + impacts); "Load sample scenario" button fills Midtown data; `?sample=1` auto-fills on mount. Client-side zod validation with inline field errors. Submit → POST `/api/generate` → loading state ("Drafting your change request…" with progress shimmer) → render `SampleOutput` with badge: `source === "openai"` → amber "Live AI" badge; else neutral "Sample Mode" badge with tooltip "Set OPENAI_API_KEY to generate live." Copy-to-clipboard button per section + "Print / Save PDF" button (`window.print()`).

- [ ] **Step 1: Build form + submission flow.**
- [ ] **Step 2: Verify in browser** — validation errors show; sample prefill works; submit renders full package with Sample Mode badge (no key set); print stylesheet produces clean output.
- [ ] **Step 3: Run gates** — lint/typecheck/test/build pass.
- [ ] **Step 4: Commit** — `git commit -m "feat: add interactive demo form and change request output"`

---

### Task 8: Workflow page (Zapier explainer)

**Files:**
- Create: `src/app/workflow/page.tsx`

**Content:** presentation-ready explainer: hero ("The Automation, End to End — one Zap, six steps, zero heroics"); vertical `WorkflowDiagram` with per-step expanded cards:
1. **Trigger — New form submission** (Zapier Webhooks/Forms; placeholder: `ZAPIER_WEBHOOK_URL`)
2. **Formatter — Clean the inputs** (trim text, normalize labels, split name fields)
3. **OpenAI — Draft the change request** (model + prompt summary; placeholder: `OPENAI_API_KEY`)
4. **Create Google Doc / PDF** (template merge; placeholder: Google OAuth connection)
5. **Email the Project Manager** (Gmail/Outlook step; PM email from the form)
6. **Store the record** (Supabase / Google Sheets / Airtable; placeholder: connection + table)
Each card: what it does, why it exists, the fields it consumes/produces, and an amber "credential placeholder" chip where keys go. Closing section: "What you'd connect on day one" checklist + note that this app's `/api/generate` mirrors step 3 so the demo runs without Zapier.

- [ ] **Step 1: Build page.** **Step 2: Verify in browser + run gates.** **Step 3: Commit** — `git commit -m "feat: add Zapier workflow explainer page"`

---

### Task 9: Proposal page (print-styled)

**Files:**
- Create: `src/app/proposal/page.tsx`, `src/components/doc.tsx` (shared `DocShell`, `DocSection` — paper-white document card on dark chrome; `@media print` hides chrome, white background, serif-adjacent sizing, page margins)

**Content (realistic consulting proposal, client "Meridian Electric Co.", provider "That's Extra"):** Executive Summary; Business Problem (quantified: industry-typical 3–5% of contract value lost to undocumented extras; example math on $2.4M annual volume); Proposed Solution (field capture + Zapier + AI change requests); Deliverables (configured workflow, branded CR template, team training, 30-day tuning); Timeline (2 weeks: Week 1 discovery + configuration, Week 2 pilot + training); Pricing ($4,800 implementation + $349/mo platform, 30-day satisfaction guarantee); Implementation Process (5 steps); Acceptance (signature block with name/title/date lines). Print button.

- [ ] **Step 1: Build `doc.tsx` + page.** **Step 2: Verify screen + print preview.** **Step 3: Run gates + commit** — `git commit -m "feat: add consulting proposal template"`

---

### Task 10: Contract page (print-styled)

**Files:**
- Create: `src/app/contract/page.tsx` (reuses `DocShell`)

**Content:** Professional Services Agreement between That's Extra ("Provider") and client ("Client"): Scope of Services; Client Responsibilities; Fees (mirrors proposal pricing); Payment Terms (50% on signing, 50% on go-live; net 15; monthly fee billed on go-live anniversary); Intellectual Property (provider retains platform IP; client owns their data and generated documents); Confidentiality (mutual); Support (business-hours email, 1-business-day response); Warranty Disclaimer (AS-IS for AI-generated drafts; client reviews before sending — plain-English note that AI output is a draft, not legal/contractual advice); Termination (30 days written notice; data export on exit); Signature Page (both parties: name, title, signature, date). Header note: "Template for demonstration — have your attorney review before use."

- [ ] **Step 1: Build page.** **Step 2: Verify screen + print.** **Step 3: Run gates + commit** — `git commit -m "feat: add client services agreement template"`

---

### Task 11: README + final verification sweep

**Files:**
- Create: `README.md`, `.env.example` (`OPENAI_API_KEY=sk-...your key here...`)

**README sections:** What is That's Extra (one paragraph + tagline); Architecture (routes table, generation flow diagram, fallback design); Setup (`npm i`, `.env.local`, `npm run dev`); Testing (`npm test`, what's covered); Deployment (Vercel GitHub import OR `npx vercel`, env var setup); **Presentation notes** (Monday run-of-show: 1. open `/` and narrate the problem → 2. `/workflow` for the automation story → 3. `/demo?sample=1`, run generation live → 4. show `/proposal` and `/contract` as the written deliverables; timing suggestions; fallback talking point if Wi-Fi dies: Sample Mode is the resilience feature, sell it as one).

- [ ] **Step 1: Write README + .env.example.**
- [ ] **Step 2: Full gate run** — `npm run typecheck && npm run lint && npm test && npm run build` → all PASS (paste output honestly).
- [ ] **Step 3: Browser sweep** — all five routes at 1440px and 375px; demo submission end-to-end; both docs print-previewed.
- [ ] **Step 4: Commit** — `git commit -m "docs: add README with architecture, deploy, and presentation notes"`

---

### Task 12: GitHub + PR + Vercel readiness

**Files:** none new (repo operations)

- [ ] **Step 1: Create GitHub repo and push**

```bash
gh repo create thats-extra --private --source . --push
git push -u origin feat/thats-extra-app
```

- [ ] **Step 2: Open PR** `feat/thats-extra-app` → `main` with summary of deliverables; merge after review so `main` is deployable.
- [ ] **Step 3: Hand Michael the deploy steps** (Vercel dashboard → Import `thats-extra` → add `OPENAI_API_KEY` (optional) → Deploy; or `npx vercel login` + `npx vercel --prod`). Vercel login is interactive — Michael runs it via `! npx vercel login` if he wants CLI deploy in-session.

---

## Self-Review

- **Spec coverage:** hero/problem/solution/automation/demo-scenario/benefits (T6), demo form + package output (T7, T2–4), workflow docs with placeholders (T8), proposal (T9), contract (T10), README + presentation notes (T11), deploy (T12), responsive + print (T5–10 gates). ✔
- **Placeholder scan:** all steps carry concrete code, copy, or exact commands; content decks are normative. ✔
- **Type consistency:** `FieldReport`, `ChangeRequestPackage`, `GenerateResponse.pkg`, `generateSamplePackage`, `handleGenerate`, `generateWithOpenAI` used consistently across T2–T7. ✔
