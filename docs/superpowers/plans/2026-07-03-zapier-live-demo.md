# Zapier Live Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the app's `/demo` form to a real six-step Zap (webhook → formatter → OpenAI → Google Doc → Resend email → Sheets log) so the automation described on `/workflow` runs live during the demo.

**Architecture:** A new `src/lib/zapier.ts` module forwards the validated field report to `ZAPIER_WEBHOOK_URL` after a successful package generation, reporting `sent | skipped | failed` truthfully through the API response into the demo form UI. The Zap itself is built in Zapier's editor and reproduced click-by-click in a committed runbook.

**Tech Stack:** Next.js 15 App Router, Zod, vitest, Zapier (Webhooks, Formatter, OpenAI, Google Docs, Resend, Google Sheets), Vercel env vars.

**Spec:** `docs/superpowers/specs/2026-07-03-zapier-live-demo-design.md`

## Global Constraints

- Branch: all work on `feat/zapier-live-demo`; PR at the end; never commit to `main`.
- Conventional Commits.
- `ZAPIER_WEBHOOK_URL` unset ⇒ behavior identical to today (`zapier: "skipped"`, no UI note).
- A Zapier failure must never fail the user-facing response; a 400 validation failure must never fire the webhook.
- Webhook forward timeout: exactly 3000 ms via `AbortSignal.timeout(3000)`.
- The webhook payload is the **validated `FieldReport`** — nothing more.
- Note (deliberate refinement of the spec): the forward fires on any successful generation (`source: "openai"` **or** `"sample"`), so a Groq hiccup doesn't kill the automation beat — the Zap drafts its own content anyway.
- Before declaring done: `npx tsc --noEmit`, `npx eslint .`, and `npx vitest run` must pass.

---

### Task 1: Zapier forwarding module

**Files:**
- Modify: `src/lib/schema.ts` (add `ZapierStatus` type)
- Create: `src/lib/zapier.ts`
- Test: `src/lib/zapier.test.ts`

**Interfaces:**
- Consumes: `FieldReport` from `@/lib/schema`; `process.env.ZAPIER_WEBHOOK_URL`.
- Produces: `type ZapierStatus = "sent" | "skipped" | "failed"` (exported from `@/lib/schema`); `forwardToZapier(report: FieldReport, deps?: { fetchFn?: typeof fetch }): Promise<ZapierStatus>` (exported from `@/lib/zapier`).

- [ ] **Step 1: Add the `ZapierStatus` type to the schema module**

In `src/lib/schema.ts`, directly above the `GenerateResponse` type, add:

```ts
export type ZapierStatus = "sent" | "skipped" | "failed";
```

(It lives in `schema.ts`, not `zapier.ts`, because `zapier.ts` imports `FieldReport` from `schema.ts` — defining it here avoids an import cycle when `GenerateResponse` picks it up in Task 2.)

- [ ] **Step 2: Write the failing tests**

Create `src/lib/zapier.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { forwardToZapier } from "@/lib/zapier";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";

afterEach(() => vi.unstubAllEnvs());

const HOOK = "https://hooks.zapier.com/hooks/catch/123/abc/";

describe("forwardToZapier", () => {
  it("skips when ZAPIER_WEBHOOK_URL is not set", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", "");
    const fetchFn = vi.fn();
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("skipped");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("POSTs the report as JSON and reports sent on 200", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("sent");
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe(HOOK);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual(MIDTOWN_SCENARIO);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("reports failed on a non-2xx response", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 500 }));
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("failed");
  });

  it("reports failed when fetch rejects (network error / timeout)", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockRejectedValue(new Error("timeout"));
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("failed");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/lib/zapier.test.ts`
Expected: FAIL — `Cannot find module '@/lib/zapier'` (or equivalent resolution error).

- [ ] **Step 4: Write the implementation**

Create `src/lib/zapier.ts`:

```ts
import type { FieldReport, ZapierStatus } from "@/lib/schema";

/**
 * Forwards a validated field report to the Zapier catch-hook that runs the
 * live six-step automation (see docs/zapier/zap-setup.md). Never throws:
 * the demo's on-screen result must render whether or not the automation
 * fires, so failures are logged and reported as a status instead.
 */
export async function forwardToZapier(
  report: FieldReport,
  deps: { fetchFn?: typeof fetch } = {},
): Promise<ZapierStatus> {
  const url = process.env.ZAPIER_WEBHOOK_URL;
  if (!url) return "skipped";

  const fetchFn = deps.fetchFn ?? fetch;
  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`zapier: webhook responded ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("zapier: webhook dispatch failed:", err);
    return "failed";
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/zapier.test.ts`
Expected: 4 passed.

- [ ] **Step 6: Commit**

```bash
git add src/lib/schema.ts src/lib/zapier.ts src/lib/zapier.test.ts
git commit -m "feat: add Zapier webhook forwarding module"
```

---

### Task 2: Wire forwarding into the generate handler

**Files:**
- Modify: `src/lib/schema.ts:49-52` (`GenerateResponse` gains `zapier`)
- Modify: `src/lib/generate-handler.ts`
- Test: `src/lib/generate-handler.test.ts` (extend)

**Interfaces:**
- Consumes: `forwardToZapier` from Task 1.
- Produces: `GenerateResponse` now `{ source: "openai" | "sample"; pkg: ChangeRequestPackage; zapier: ZapierStatus }`; `handleGenerate(body, deps?)` accepts optional `deps.forward: typeof forwardToZapier`.

- [ ] **Step 1: Write the failing tests**

Append to the `describe("handleGenerate", ...)` block in `src/lib/generate-handler.test.ts` (and add `forwardToZapier`-shaped mocks via the new `forward` dep):

```ts
  it("reports the zapier dispatch status on success responses", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const forward = vi.fn().mockResolvedValue("sent");
    const r = await handleGenerate(MIDTOWN_SCENARIO, { forward });
    expect(r.json).toMatchObject({ source: "sample", zapier: "sent" });
    expect(forward).toHaveBeenCalledWith(
      expect.objectContaining({ projectName: MIDTOWN_SCENARIO.projectName }),
    );
  });

  it("forwards to zapier on the openai path too", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const fake = generateSamplePackage(MIDTOWN_SCENARIO);
    const forward = vi.fn().mockResolvedValue("skipped");
    const r = await handleGenerate(MIDTOWN_SCENARIO, {
      generate: vi.fn().mockResolvedValue(fake),
      forward,
    });
    expect(r.json).toMatchObject({ source: "openai", zapier: "skipped" });
  });

  it("does not forward to zapier on validation failure", async () => {
    const forward = vi.fn();
    await handleGenerate({ nope: true }, { forward });
    expect(forward).not.toHaveBeenCalled();
  });
```

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `npx vitest run src/lib/generate-handler.test.ts`
Expected: the 3 new tests FAIL (unknown `forward` dep / missing `zapier` in response); the 4 existing tests still pass.

- [ ] **Step 3: Update the schema type**

In `src/lib/schema.ts`, change `GenerateResponse` to:

```ts
export type GenerateResponse = {
  source: "openai" | "sample";
  pkg: ChangeRequestPackage;
  zapier: ZapierStatus;
};
```

- [ ] **Step 4: Update the handler**

Replace the body of `src/lib/generate-handler.ts` with:

```ts
import { fieldReportSchema, type GenerateResponse } from "@/lib/schema";
import { generateSamplePackage } from "@/lib/generator";
import { generateWithOpenAI } from "@/lib/openai";
import { forwardToZapier } from "@/lib/zapier";

export type GenerateResult = {
  status: number;
  json: GenerateResponse | { error: string };
};

/**
 * Framework-free request handler for /api/generate. Validates the body,
 * tries OpenAI when a key is configured, and falls back to the
 * deterministic sample generator on any failure — the demo never 500s.
 * Successful generations are also forwarded to the live Zapier automation
 * (a no-op unless ZAPIER_WEBHOOK_URL is configured).
 */
export async function handleGenerate(
  body: unknown,
  deps: { generate?: typeof generateWithOpenAI; forward?: typeof forwardToZapier } = {},
): Promise<GenerateResult> {
  const parsed = fieldReportSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const field = first.path.join(".") || "request body";
    return {
      status: 400,
      json: { error: `Invalid field report: ${field} — ${first.message}` },
    };
  }

  const report = parsed.data;
  const generate = deps.generate ?? generateWithOpenAI;
  const forward = deps.forward ?? forwardToZapier;

  if (process.env.OPENAI_API_KEY) {
    try {
      const pkg = await generate(report);
      return { status: 200, json: { source: "openai", pkg, zapier: await forward(report) } };
    } catch (err) {
      console.warn("generate: falling back to sample:", err);
    }
  }

  return {
    status: 200,
    json: { source: "sample", pkg: generateSamplePackage(report), zapier: await forward(report) },
  };
}
```

- [ ] **Step 5: Run the full test suite, typecheck, lint**

Run: `npx vitest run && npx tsc --noEmit && npx eslint .`
Expected: all pass. (Existing handler tests keep passing because the real `forwardToZapier` returns `"skipped"` when the env var is unset in tests.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/schema.ts src/lib/generate-handler.ts src/lib/generate-handler.test.ts
git commit -m "feat: forward successful generations to the Zapier webhook"
```

---

### Task 3: Demo form dispatch note

**Files:**
- Modify: `src/components/demo-form.tsx:286-293` (the `result` render block)

**Interfaces:**
- Consumes: `result.zapier` (`GenerateResponse` from Task 2 — the client already stores the whole response in `result`).
- Produces: user-visible status line; no exported API.

- [ ] **Step 1: Add the status note to the result block**

In `src/components/demo-form.tsx`, replace the `{result ? (...) : null}` block at the bottom with:

```tsx
      {result ? (
        <div ref={resultRef} className="scroll-mt-24">
          <div className="print-hidden mb-4 flex items-center justify-between gap-3">
            {result.zapier === "sent" ? (
              <p className="text-sm text-fog">
                Also dispatched to the live automation — check the PM&apos;s inbox.
              </p>
            ) : result.zapier === "failed" ? (
              <p className="text-sm text-amber">
                Automation dispatch failed — the package below is unaffected.
              </p>
            ) : (
              <span />
            )}
            <PrintButton />
          </div>
          <SampleOutput pkg={result.pkg} source={result.source} />
        </div>
      ) : null}
```

(The empty `<span />` keeps `justify-between` pushing the print button right when the status is `skipped` — the normal state for anyone running without the webhook configured.)

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000/demo`, load the sample scenario, submit.
Expected: no status line (env unset ⇒ `skipped`), print button aligned right, package renders. Then stop the dev server, run once more with the env var pointing at a dead URL to see the amber failure note: `ZAPIER_WEBHOOK_URL=http://localhost:9/x npm run dev` — submit again, expect "Automation dispatch failed" and the package still rendering.

- [ ] **Step 3: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint .
git add src/components/demo-form.tsx
git commit -m "feat: show automation dispatch status on the demo form"
```

---

### Task 4: Copy updates — /workflow note and demo script beat

**Files:**
- Modify: `src/app/workflow/page.tsx:177-182` (the "Note for the demo" paragraph)
- Modify: `docs/demo-script.md:39` (automation beat) and `docs/demo-script.md:47` (live-demo beat)

**Interfaces:** none (copy only).

- [ ] **Step 1: Update the /workflow closing note**

In `src/app/workflow/page.tsx`, replace the inner text of the note paragraph (keep the surrounding `<p>` and classes):

```tsx
              <span className="font-semibold text-bright">Note for the demo:</span> the{" "}
              <code className="font-utility text-amber">/demo</code> form on this site is wired
              to a live version of this exact Zap — submitting it really does create the doc,
              email the PM, and append the log row. The app&apos;s own{" "}
              <code className="font-utility text-amber">/api/generate</code> route still mirrors
              step 3, so the on-screen result renders even if the automation is offline.
```

- [ ] **Step 2: Update the demo script**

In `docs/demo-script.md` line 39, change the sentence "The amber chips you see are where the client's credentials plug in on day one." to:

```markdown
The amber chips you see are where the client's credentials plug in on day one — and this isn't a diagram of a hypothetical: the Zap you're looking at is live, and you'll see it fire in a minute.
```

In `docs/demo-script.md`, after the paragraph ending "...this document exists before he's back on the lift." (line 47), add:

```markdown
>
> *(Switch to the PM inbox tab — the email should already be there.)* And while we were reading, the automation finished the rest of the job: the project manager just received this email — from the company's own domain — with the branded change request attached, and the log picked up a new row. Nobody touched anything after the foreman hit submit.
```

- [ ] **Step 3: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint .
git add src/app/workflow/page.tsx docs/demo-script.md
git commit -m "docs: update workflow note and demo script for the live Zap"
```

---

### Task 5: Zap setup runbook

**Files:**
- Create: `docs/zapier/zap-setup.md`

**Interfaces:**
- Consumes: the ten package keys from `changeRequestPackageSchema` (`title, executiveSummary, existingCondition, requestedChange, laborImpact, materialImpact, scheduleImpact, recommendedNextStep, customerFacingRequest, emailDraft`) and the system prompt in `src/lib/openai.ts:13-22`.
- Produces: the click-by-click document used in Task 6 to build the Zap.

- [ ] **Step 1: Write the runbook**

Create `docs/zapier/zap-setup.md` with exactly this content:

````markdown
# That's Extra — Live Zap Setup Runbook

Reproduces the six-step Zap that powers the live demo. Build it top to bottom in
zapier.com's editor. Every value you must type or pick is spelled out; anything in
`{{double braces}}` means "map this field from a previous step in the Zapier UI".

## Prerequisites

- Zapier account with multi-step Zaps + premium apps active (trial or paid).
- OpenAI API key with credit (platform.openai.com → API keys).
- Google account (support@windwardline.com) — used ONLY for Docs/Drive/Sheets.
- Resend account with the windwardline.com domain verified and an API key.

## Step 1 — Trigger: Webhooks by Zapier, "Catch Hook"

1. App: **Webhooks by Zapier** → Event: **Catch Hook**. No child key.
2. Copy the hook URL (`https://hooks.zapier.com/hooks/catch/...`).
3. Send test data before continuing: set `ZAPIER_WEBHOOK_URL=<hook-url>` in
   `.env.local`, run `npm run dev`, open `http://localhost:3000/demo`, click
   **Load sample scenario**, and submit. Zapier should show the twelve fields:
   companyName, projectName, submittedBy, trade, changeType, description, laborImpact,
   materialImpact, scheduleImpact, urgency, requestedNextStep, pmEmail.

## Step 2 — Formatter by Zapier, "Text → Trim Whitespace"

1. App: **Formatter by Zapier** → Event: **Text** → Transform: **Trim Whitespace**.
2. Input: `{{description}}`. (One formatter step is the story beat; the AI step
   handles other normalization fine. Output referenced below as the trimmed description.)

## Step 3 — OpenAI, "Conversation"

1. App: **OpenAI (GPT-4, DALL-E, Whisper)** → Event: **Conversation**.
2. Connect with the OpenAI API key. Model: **gpt-4o-mini**.
3. **Assistant Instructions** (system prompt — port of `src/lib/openai.ts`, with JSON
   enforcement moved into the prompt because the Zapier action has no
   response_format switch):

   ```
   You are a professional construction change-request writer working on behalf of a
   specialty-trade subcontractor. Given a field report, draft a complete, professional
   change request package a real subcontractor would send to a general contractor.

   Return ONLY a JSON object — no prose, no markdown fences — with exactly these
   string keys: title, executiveSummary, existingCondition, requestedChange,
   laborImpact, materialImpact, scheduleImpact, recommendedNextStep,
   customerFacingRequest, emailDraft.

   Rules:
   - Formal, confident, factual tone. No hedging, no apologies.
   - Weave the report's actual company, project, impacts, urgency, and requested next
     step into every relevant section.
   - customerFacingRequest is a formal multi-paragraph change request suitable to
     forward to the GC.
   - emailDraft is a ready-to-send email to the project manager, signed by the
     submitter.
   - Do not invent dollar amounts unless they appear in the report.
   ```

4. **User Message** — map the fields:

   ```
   companyName: {{companyName}}
   projectName: {{projectName}}
   submittedBy: {{submittedBy}}
   trade: {{trade}}
   changeType: {{changeType}}
   description: {{trimmed description from step 2}}
   laborImpact: {{laborImpact}}
   materialImpact: {{materialImpact}}
   scheduleImpact: {{scheduleImpact}}
   urgency: {{urgency}}
   requestedNextStep: {{requestedNextStep}}
   ```

5. Test the step. If the OpenAI reply's ten keys appear as individually mappable
   fields, continue. If the reply arrives as one opaque text blob, insert a
   **Formatter by Zapier → Utilities → Parse JSON** step (input: the OpenAI reply)
   so steps 4–6 can map `title`, `emailDraft`, etc. If the reply is wrapped in
   ```json fences, first add **Formatter → Text → Replace** to strip the fences,
   then Parse JSON.

## Step 4 — Google Docs, "Create Document from Template"

1. First, in Google Docs (support@windwardline.com), create a template named
   **"That's Extra — Change Request Template"** with this body (placeholders in
   double braces are Google Docs merge fields):

   ```
   {{title}}

   CHANGE REQUEST — {{projectName}}
   Prepared by {{companyName}} | Submitted by {{submittedBy}} | Urgency: {{urgency}}

   EXECUTIVE SUMMARY
   {{executiveSummary}}

   EXISTING CONDITION
   {{existingCondition}}

   REQUESTED CHANGE
   {{requestedChange}}

   LABOR IMPACT
   {{laborImpact}}

   MATERIAL IMPACT
   {{materialImpact}}

   SCHEDULE IMPACT
   {{scheduleImpact}}

   RECOMMENDED NEXT STEP
   {{recommendedNextStep}}

   FORMAL CHANGE REQUEST
   {{customerFacingRequest}}
   ```

   Style the header lines (bold title, amber rule if you like) — merge only fills text.
2. Zap step — App: **Google Docs** → Event: **Create Document from Template**.
3. Template: the doc above. New document name:
   `Change Request — {{projectName}} — {{zap_meta_human_now}}`.
4. Folder: create/pick **"Thats Extra Demo"** in Drive. Map each merge field from the
   OpenAI step's parsed keys (plus `projectName`, `companyName`, `submittedBy`,
   `urgency` from the trigger).
5. Toggle **"Export Formats" / include PDF** if offered by the action version; the
   output in any case includes the new document's ID and links.

## Step 5 — Resend, "Send Email"

1. App: **Resend** → Event: **Send Email**. Connect with the Resend API key.
2. From: `changerequests@windwardline.com` (any verified windwardline.com sender).
   From Name: `That's Extra`.
3. To: `{{pmEmail}}` (from the trigger).
4. Subject: `Change Request — {{projectName}} ({{urgency}} urgency)`.
5. Body (HTML): `{{emailDraft}}` from the OpenAI step, then this footer on a new line:
   `View the formatted change request: {{Google Docs document link from step 4}}`
6. **Attachment (the flagged open item):** if the Resend action exposes an
   Attachments field, map the PDF export:
   `https://docs.google.com/document/d/{{document id from step 4}}/export?format=pdf`
   — note this URL only works as an attachment fetch if the doc is link-readable, so
   ALSO set the Drive folder "Thats Extra Demo" to "Anyone with the link — Viewer".
   If there is no Attachments field, the body link above is the fallback (already
   included), plus mention it in the email body line: "The formatted PDF is linked
   below."

## Step 6 — Google Sheets, "Create Spreadsheet Row"

1. In Google Sheets, create **"That's Extra — Change Request Log"** with header row:
   `Date | Company | Project | Trade | Change Type | Urgency | Submitted By | PM Email | Labor Impact | Material Impact | Schedule Impact | Doc Link | Status`
2. Zap step — App: **Google Sheets** → Event: **Create Spreadsheet Row**; map:
   Date `{{zap_meta_human_now}}`, Company `{{companyName}}`, Project `{{projectName}}`,
   Trade `{{trade}}`, Change Type `{{changeType}}`, Urgency `{{urgency}}`,
   Submitted By `{{submittedBy}}`, PM Email `{{pmEmail}}`,
   Labor/Material/Schedule impacts from the trigger, Doc Link from step 4,
   Status: literal text `Sent to PM`.

## Turn it on

Name the Zap **"That's Extra — Change Request Automation"**, then toggle **On**.
Test-mode runs do not prove the toggle.

## Production wiring

```bash
vercel env add ZAPIER_WEBHOOK_URL production   # paste the catch-hook URL
vercel --prod                                   # redeploy so the env var takes effect
```

## Demo-morning smoke test (run this the day of, ~before leaving)

1. Zapier trial still active? (Settings → Plans. It expires ~2026-07-08.)
2. Zap toggled On?
3. OpenAI key has credit?
4. Submit the sample scenario at https://thatsextra.windwardline.com/demo.
5. Confirm all five artifacts:
   - [ ] On-screen package renders with the "Also dispatched…" note
   - [ ] Zap run is green in Zap History
   - [ ] Doc created in Drive ("Thats Extra Demo" folder)
   - [ ] Email in the PM inbox (from windwardline.com, doc linked/attached)
   - [ ] New row in "That's Extra — Change Request Log"
6. Leave that email in the inbox — it's Tab 5 of the demo.

## Known risks

- **Trial expiry (~5 days from 2026-07-03):** after expiry, multi-step Zaps stop
  running. The app degrades gracefully (`zapier: "failed"` note; on-screen demo
  unaffected) but the inbox beat dies. Confirm the date in Zapier settings.
- **Content parity:** the on-screen package (Groq) and the emailed doc (OpenAI) are
  independent generations from the same fields — wording differs slightly. Expected.
````

- [ ] **Step 2: Commit**

```bash
git add docs/zapier/zap-setup.md
git commit -m "docs: add click-by-click Zap setup runbook"
```

---

### Task 6: Build the Zap, wire production, verify end to end

This task is interactive — it happens in Michael's Zapier/Google/Resend accounts and
the Vercel dashboard, driven by the runbook from Task 5. An agent executes what it
can (env vars, deploy, production smoke test) and hands the account-auth steps to
Michael.

**Files:** none (external systems + Vercel env).

**Interfaces:**
- Consumes: `docs/zapier/zap-setup.md`; the deployed app at thatsextra.windwardline.com.
- Produces: a live, verified automation and a green smoke-test checklist.

- [ ] **Step 1: Build the Zap** following `docs/zapier/zap-setup.md` steps 1–6 (Michael authenticates Zapier, Google, Resend connections; test each step with the Midtown sample as you go).
- [ ] **Step 2: Toggle the Zap On.**
- [ ] **Step 3: Set the production env var and redeploy** (`vercel env add ZAPIER_WEBHOOK_URL production`, then `vercel --prod`, scope `windwardline`).
- [ ] **Step 4: Run the full smoke test** from the runbook against production; check all five artifacts.
- [ ] **Step 5: Open the PR** — `gh pr create` from `feat/zapier-live-demo` with a summary of the app change, copy updates, and runbook; include the smoke-test results in the body.
