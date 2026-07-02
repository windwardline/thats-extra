# That's Extra — Design Spec

**Date:** 2026-07-02
**Status:** Approved by Michael (this session)
**Context:** AI development class, Phase 3 presentation (Monday). Must pitch an automation
solution: landing page, live demo of the automation, written proposal template, and client
contract template. Should read as a credible early-stage SaaS product, not a class assignment.

## Product

**That's Extra** — *Every "Can You Just..." Has a Price.*

AI-powered margin recovery for commercial electrical and HVAC subcontractors. Field crews
capture extra-work evidence (notes, photos, impacts); a Zapier + OpenAI automation turns it
into a professional change request emailed to the PM and stored for reporting — before extra
work becomes free work.

Target customer: specialty-trade subs, 10–75 field employees, 20–100 active jobs. Users:
owners, PMs, ops managers, foremen.

Brand voice: Basecamp × Morning Brew × Liquid Death — witty, confident, on the contractor's
side. Humor from shared jobsite experience, never at the contractor's expense.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- `lucide-react` icons; CSS-driven scroll-reveal animations (no heavy animation lib)
- Vitest for unit tests
- OpenAI SDK (optional at runtime — see AI engine)
- No database. Demo is stateless. Supabase appears only as a placeholder storage step in the
  Zapier documentation.
- Deploy: Vercel (auto-detected Next.js). Repo: GitHub under Michael's account.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page (hero, problem, solution, workflow, demo scenario preview, benefits, CTA) |
| `/demo` | Field report form → generated change-request package |
| `/workflow` | Zapier automation explainer for the live presentation |
| `/proposal` | Consulting proposal template (screen + print-to-PDF styled) |
| `/contract` | Professional services agreement (screen + print-to-PDF styled) |
| `/api/generate` | POST — change-request generation (OpenAI with deterministic fallback) |

### Landing page sections (in order)

1. **Hero** — Headline: *Every "Can You Just..." Should Come With a Change Order.*
   Subheadline per brief. Primary CTA "Demo the Workflow" → `/demo`; secondary
   "Generate a Sample Change Request" → `/demo` pre-filled with the Midtown scenario.
   Visual workflow illustration: Foreman → Photos + Notes → Zapier → AI → Professional
   Change Request → Project Manager → Recovered Revenue.
2. **Problem** — *The Most Expensive Words on a Jobsite.* Familiar "can you just..." quotes,
   then the cost chain (nobody writes it down → photos trapped on phones → PM reconstructs
   days later → extra work quietly becomes free work).
3. **Solution** — 6 steps: foreman submits field report → photos/notes uploaded → Zapier
   processes → AI drafts change request → PM receives polished doc → record stored.
4. **Automation workflow strip** — Field Report → Zapier → AI → Change Request → Email PM →
   Stored Record. Understandable in <30 seconds.
5. **Demo scenario** — Midtown Office Renovation (fictional electrical sub): GC issues revised
   RCP, 12 fixtures relocated after rough-in; 2 electricians, 6 labor hours, lift rental, wire,
   connectors, testing. Shows the full sample AI output inline.
6. **Benefits** — cards: recover lost revenue, reduce PM admin, better field documentation,
   faster response, stronger customer communication, protected margins.
7. **CTA footer.**

### Demo form fields

Company Name, Project Name, Submitted By, Trade (Electrical | HVAC), Change Type,
Description of Changed Condition, Labor Impact, Material Impact, Schedule Impact,
Urgency, Requested Next Step, Project Manager Email. Zod-validated client + server.
"Load sample scenario" button pre-fills the Midtown data.

### Generated change-request package (both AI and fallback paths)

Change Request Title, Executive Summary, Existing Condition, Requested Change, Labor Impact,
Material Impact, Schedule Impact, Recommended Next Step, Customer-Facing Change Request,
Email Draft to the Project Manager. Rendered with copy buttons and print styling.

## AI engine (`/api/generate`)

- Zod-validates the request body (shared schema with the form).
- If `OPENAI_API_KEY` is set: call OpenAI chat completions with structured JSON output
  matching the package schema, ~15s timeout.
- On missing key, timeout, or any error: deterministic fallback generator builds a realistic
  package from the actual form inputs (parameterized templates, trade-aware wording).
- Response includes `source: "openai" | "sample"`; UI shows a small honest badge
  ("Live AI" / "Sample Mode"). The demo cannot fail.

## Written deliverables

- `/proposal` — Executive Summary, Business Problem, Proposed Solution, Deliverables,
  Timeline, Pricing, Implementation Process, Acceptance. Realistic consulting proposal.
- `/contract` — Scope of Services, Client Responsibilities, Fees, Payment Terms, IP,
  Confidentiality, Support, Warranty Disclaimer, Termination, Signature Page. Concise but real.
- Both styled for screen and for clean browser print-to-PDF (`@media print`).

## Zapier documentation (`/workflow`)

Step-by-step explainer for the presentation: Trigger (new form submission) → Formatter →
OpenAI (generate change request) → Create Google Doc/PDF → Email PM → Save record
(Supabase / Google Sheets / Airtable). Placeholder callouts wherever credentials/API keys
would be required. Written so Michael can narrate it live in under a few minutes.

## Design language

Premium B2B SaaS with a construction-tech edge — explicitly NOT a stereotypical construction
site. Charcoal/near-black base, safety-amber accent used sparingly, strong typographic
hierarchy (display font + Geist/Inter), generous spacing, subtle card borders/glows,
responsive, accessible contrast. Subtle scroll-reveal animation only.

## Testing & verification

- TDD (Vitest) on real logic: fallback generator, shared zod schemas, API route fallback
  behavior (key present/absent/error paths).
- Presentational JSX is NOT unit-tested; gate is typecheck + lint + tests + `next build`
  passing, plus in-browser verification of every route (desktop + mobile widths).
- This adaptation to the TDD-by-default rule was explicitly approved.

## Repo & deploy

- `~/Projects/thats-extra`, git initialized on `main`; spec committed as the initial commit,
  all implementation on a feature branch, merged via PR flow per global standards.
- Conventional commits. New GitHub repo under Michael's account.
- Vercel-ready: README documents `OPENAI_API_KEY` env var and deploy steps
  (`vercel` login is interactive → Michael runs it, or one-click GitHub import).
- README also includes architecture, setup, and presentation notes (what to show, in what
  order, for the Monday demo).

## Out of scope

Auth, billing, persistence, real photo upload storage, actual Zapier account wiring
(documented with placeholders instead), Supabase integration.
