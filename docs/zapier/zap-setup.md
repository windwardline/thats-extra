# That's Extra — Live Zap Setup Runbook

Reproduces the six-step Zap that powers the live demo. Build it top to bottom in
zapier.com's editor. Every value you must type or pick is spelled out; anything in
`{{double braces}}` means "map this field from a previous step in the Zapier UI".

## Prerequisites

- Zapier account with multi-step Zaps + premium apps active (trial or paid).
- OpenAI API key with credit (platform.openai.com → API keys).
- Google account (michaellynnpeacock@gmail.com) — used ONLY for Docs/Drive/Sheets.
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

1. First, in Google Docs (michaellynnpeacock@gmail.com), create a template named
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
