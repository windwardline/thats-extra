# Zapier Live Demo — Design

**Date:** 2026-07-03
**Status:** Approved pending user review
**Goal:** Make the six-step Zapier workflow described on `/workflow` actually run, live,
during the demo — triggered by the app's own `/demo` form.

## Context

The app currently *describes* the Zap but nothing is connected. The `/demo` form posts to
`/api/generate` (Groq via OpenAI-compatible endpoint) and renders the ten-section change
request package on screen. The `/workflow` page documents a six-step Zap with credential
placeholder chips.

## Decisions (made with Michael, 2026-07-03)

| Decision | Choice |
|---|---|
| Live scope | All six steps run for real |
| Zapier plan | Free account with trial capabilities active through demo day (~5 days) |
| AI step | Zapier's native OpenAI app (gpt-4o-mini) with Michael's OpenAI key |
| Doc/PDF step | Google Docs template merge via personal Gmail (michaellynnpeacock@gmail.com), used only for Docs/Drive |
| Email step | Resend, sending from a windwardline.com address |
| Storage step | Google Sheets |
| Trigger path | Server-side forward from `/api/generate` to `ZAPIER_WEBHOOK_URL` (Vercel env var) |

## Architecture

Two halves, joined at the webhook.

### Half 1 — App change

`src/app/api/generate/route.ts` gains one responsibility: after Zod validation passes
**and** Groq generation succeeds, POST the raw validated field report (the twelve fields)
to `process.env.ZAPIER_WEBHOOK_URL`.

- Forwarding logic lives in a new module `src/lib/zapier.ts` (testable in isolation).
- The call is awaited with `AbortSignal.timeout(3000)`.
- The API response gains a field: `zapier: "sent" | "skipped" | "failed"`.
  - `skipped` — env var unset. Normal state for local dev/forks/post-trial. No UI note.
  - `sent` — demo form shows a confirmation line: "Also dispatched to the live
    automation — check the PM's inbox." (This is a demo beat.)
  - `failed` — logged server-side with the real error; quiet "automation dispatch
    failed" note in the UI. The on-screen package still renders.
- A Zapier failure never fails the user-facing response; a Groq failure never triggers
  the webhook (no half-baked PM emails).

### Half 2 — The Zap

Built in Zapier's editor; reproducible from a click-by-click runbook committed at
`docs/zapier/zap-setup.md` (step configs, ported prompt text, Doc template content,
smoke-test checklist).

1. **Webhooks by Zapier — Catch Hook.** Receives the raw field report JSON.
2. **Formatter.** Trim whitespace; normalize trade and urgency labels.
3. **OpenAI — gpt-4o-mini, JSON output.** Prompt ported verbatim from the app's
   generate route so the ten-section package structure matches.
4. **Google Docs — Create Document from Template** (branded template with merge
   fields), exported as PDF. Personal Gmail connection, Docs/Drive scope only.
5. **Resend — Send email** to the form's `pmEmail` from a windwardline.com sender,
   PDF attached. *Open item to verify during implementation: whether Zapier's Resend
   action supports attachments; fallback is a prominent Drive link to the PDF in the
   email body.*
6. **Google Sheets — Create Spreadsheet Row.** Date, project, trade, urgency, impacts,
   doc link.

### Known caveat — content parity

The on-screen package (Groq) and the emailed PDF (OpenAI inside the Zap) are generated
independently from the same fields; wording will differ slightly. Accepted: they are two
runs of the same system. Noted here so it isn't a surprise mid-demo.

## Error handling

- **App side:** as above — statuses reported truthfully, real errors logged, visible
  demo never blocked by automation failures.
- **Zap side:** Zapier defaults. A failed step halts the run (visible in Zap History
  with payload); transient errors auto-retry. No continue-on-error overrides — no email
  beats an email with a broken attachment.

## Testing

- **Unit (vitest, TDD):** `src/lib/zapier.ts` — env unset → `skipped`; 200 → `sent`;
  non-2xx/timeout → `failed`; payload is exactly the validated field report.
- **Zap-level:** Zapier's step tester with the Midtown sample scenario at each step.
- **End-to-end (the real gate):** submit the sample scenario on production and confirm
  all five artifacts: on-screen package, green Zap run, Doc+PDF in Drive, email in the
  PM inbox via Resend, row in the Sheet. This is the demo-morning smoke test.

## Demo-day risk checklist (also goes in the runbook)

- Zapier trial expires ~5 days from 2026-07-03 — run the smoke test the morning of the
  demo while the trial is confirmed active. After expiry the account silently loses
  multi-step Zaps and premium apps.
- OpenAI key needs credit (a few dollars) — verify before demo day.
- The Zap must be toggled **On** — test-mode runs don't prove that.
- Use a PM email that can be opened live on stage (a windwardline.com address).

## Content updates

- `/workflow` closing note: change "runs without a Zapier account connected" to reflect
  that the live demo is wired to a real Zap.
- `docs/demo-script.md`: add the beat — submit the form, then switch to the PM inbox.

## Implementation deviations (agreed during build, 2026-07-03)

- **AI step is Groq, not the Zapier OpenAI app.** Michael chose Groq (free) mid-build;
  step 3 is a Webhooks "Custom Request" POST to api.groq.com (openai/gpt-oss-120b),
  and the webhook payload gained an embed-safe `reportJson` field to keep the request
  body valid regardless of quotes/newlines in report fields.
- **A Parse JSON formatter step was added** (the Groq reply's package JSON arrives as
  one string), so the live Zap has seven steps.
- **Google Doc is created from text, not a template** — no manual template setup;
  branded structure comes from the step's HTML content.
- **Email goes out via Resend with no PDF attachment**: Resend fetches attachment URLs
  anonymously and Google's authenticated PDF export URL 401s. The email carries the
  full AI-drafted body; the doc link lives in the Sheets log.
- `/workflow` copy updated to match (Groq, Resend, Google Sheets).

## Out of scope

- Zapier Interfaces/Forms as an alternative trigger.
- Supabase/Airtable storage.
- Any change to the Groq-backed on-screen generation path.
