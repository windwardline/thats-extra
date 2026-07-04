# That's Extra — Live Zap Setup Runbook (as built, 2026-07-03)

Documents the live Zap **"That's Extra — Change Request Automation"** exactly as it
runs in production. Rebuild it top to bottom in zapier.com's editor from this file.
Anything in `{{double braces}}` means "map this field from a previous step in the
Zapier UI".

**Live wiring:** the app's `/api/generate` forwards every successful generation to the
catch hook (`ZAPIER_WEBHOOK_URL` env var on Vercel, scope `windwardline`). The payload
is the twelve validated field-report fields plus `reportJson` — a pre-escaped
serialization of the report that can be embedded verbatim inside a JSON string
(see `src/lib/zapier.ts`).

## Prerequisites

- Zapier account with multi-step Zaps + premium apps (trial active through **Jul 8, 2026**).
- Groq API key (console.groq.com — free tier).
- Google account (michaellynnpeacock@gmail.com) — Docs/Drive + Sheets connections.
- Resend account with windwardline.com verified and a **Full access** API key.
- DNS (Cloudflare, zone windwardline.com): Resend's DKIM + send-subdomain SPF records,
  plus a DMARC record — `_dmarc` TXT `"v=DMARC1; p=none; rua=mailto:michaellynnpeacock@gmail.com; fo=1"`
  (added 2026-07-04; without DMARC, iCloud/Gmail route the change-request emails to Spam).
- Google Sheet **"That's Extra - Change Request Log"** with header row:
  `Date | Company | Project | Trade | Change Type | Urgency | Submitted By | PM Email | Labor Impact | Material Impact | Schedule Impact | Doc Link | Status`

## Step 1 — Trigger: Webhooks by Zapier, "Catch Hook"

1. App: **Webhooks by Zapier** → Event: **Catch Hook**. No child key.
2. Copy the hook URL and set it as `ZAPIER_WEBHOOK_URL` (see Production wiring).
3. Send test data: with the env var set locally (`ZAPIER_WEBHOOK_URL=<hook-url> npm run dev`),
   submit the sample scenario on `http://localhost:3000/demo`, then "Find new records"
   and pick the newest request. Confirm the thirteen fields arrive (twelve report
   fields + `reportJson`).

## Step 2 — Formatter by Zapier, "Text → Trim Whitespace"

1. App: **Formatter by Zapier** → Event: **Text** → Transform: **Trim Whitespace**.
2. Input: `{{description}}` from step 1.

## Step 3 — Webhooks by Zapier, "Custom Request" → Groq

1. App: **Webhooks by Zapier** → Event: **Custom Request**.
2. Method: **POST**. URL: `https://api.groq.com/openai/v1/chat/completions`.
3. **Data** (raw JSON body — the `{{Report Json}}` chip comes from step 1; the
   system prompt mirrors `src/lib/openai.ts` with JSON enforcement in-prompt):

   ```
   {"model": "openai/gpt-oss-120b", "response_format": {"type": "json_object"}, "messages": [{"role": "system", "content": "You are a professional construction change-request writer working on behalf of a specialty-trade subcontractor. Given a field report, draft a complete, professional change request package a real subcontractor would send to a general contractor.\n\nReturn a JSON object with exactly these string keys: title, executiveSummary, existingCondition, requestedChange, laborImpact, materialImpact, scheduleImpact, recommendedNextStep, customerFacingRequest, emailDraft.\n\nRules:\n- Formal, confident, factual tone. No hedging, no apologies.\n- Weave the report's actual company, project, impacts, urgency, and requested next step into every relevant section.\n- customerFacingRequest is a formal multi-paragraph change request suitable to forward to the GC.\n- emailDraft is a ready-to-send email to the project manager, signed by the submitter. It must contain only the email body with no To:, Subject:, or other header lines, and it must start directly with the greeting.\n- Do not invent dollar amounts unless they appear in the report."}, {"role": "user", "content": "{{Report Json}}"}]}
   ```

4. Headers: `Content-Type: application/json` and `Authorization: Bearer <GROQ_API_KEY>`.
5. Return Raw Response: **No** (parsed response exposes `Choices Message Content`).
6. Gotcha: gpt-oss-120b is a reasoning model — the output includes both
   `Choices Message Reasoning` and `Choices Message Content`. Only Content holds the
   package JSON.

## Step 4 — Formatter by Zapier, "Utilities → Parse JSON"

1. App: **Formatter by Zapier** → Event: **Utilities** → Transform: **Parse JSON**.
2. Input: `{{Choices Message Content}}` from step 3.
3. Output: the ten package keys as mappable fields (`Output Title`,
   `Output Email Draft`, `Output Customer Facing Request`, …).

## Step 5 — Google Docs, "Create Document From Text"

1. App: **Google Docs** → Event: **Create Document From Text**.
   Account: michaellynnpeacock@gmail.com.
2. Document Name: `Change Request — {{Project Name}}` (from step 1).
3. Document Content (limited HTML):
   `<h1>{{Output Title}}</h1>` newline `{{Output Customer Facing Request}}` newline
   `<hr>` newline `Prepared and submitted via That's Extra — every "can you just" has a price.`
4. Folder: root. Export Formats: **PDF**.
5. Output includes `Alternate Link` (doc URL) used by step 7.

## Step 6 — Resend, "Send Email"

1. App: **Resend** → Event: **Send Email**. Connect with a **Full access** API key
   (sending-scoped keys 401 on Zapier's post-send read call — the email still sends
   but the Zap run fails and halts the remaining steps).
2. From: `That's Extra <changerequests@windwardline.com>`.
3. To: `{{Pm Email}}` (step 1).
4. Subject: `Change Request — {{Project Name}} ({{Urgency}} urgency)`.
5. Plain Text: `{{Output Email Draft}}` (step 4).
6. **No attachment.** Do not map the Google Docs PDF export link into the Attachment
   field: Resend fetches attachment URLs anonymously, Google's export URL requires
   auth, and the fetch fails with "Unauthorized". The PM gets the full drafted email;
   the doc/PDF lives in Drive and is linked from the log.

## Step 7 — Google Sheets, "Create Spreadsheet Row"

1. App: **Google Sheets** → Event: **Create Spreadsheet Row**.
   Account: michaellynnpeacock@gmail.com.
2. Spreadsheet: **That's Extra - Change Request Log**. Worksheet: **Sheet1**.
3. Column mapping: Date = system variable **Current time: UTC (ISO)**;
   Company/Project/Trade/Change Type/Urgency/Submitted By/PM Email/Labor Impact/
   Material Impact/Schedule Impact = the matching step 1 fields;
   Doc Link = `{{Alternate Link}}` (step 5); Status = literal `Sent to PM`.

## Publish

Name the Zap **"That's Extra — Change Request Automation"**, then **Publish** (this
turns it on). Published **2026-07-03**, version v1, first production run Successful.
v2 published **2026-07-04** ("emailDraft body only, no Subject/To header lines"):
tightened the step 3 emailDraft rule so the email body no longer opens with a
duplicated Subject line; verified with a production run the same day.

## Production wiring

```bash
printf '<hook-url>' | vercel env add ZAPIER_WEBHOOK_URL production --scope windwardline
vercel --prod --scope windwardline
```

## Demo-morning smoke test

1. Zapier trial still active? (Sidebar: "Zapier Pro trial ends Jul 8".)
2. Zap shows **On** at zapier.com/app/zaps?
3. Submit the sample scenario at https://thatsextra.windwardline.com/demo.
4. Confirm all five artifacts:
   - [ ] On-screen package renders with the "Also dispatched…" note
   - [ ] Zap run **Successful** in zapier.com/app/history
   - [ ] New "Change Request — …" doc in Drive
   - [ ] Email in pm@windwardline.com from changerequests@windwardline.com
   - [ ] New row in "That's Extra - Change Request Log"
5. Leave that email in the inbox — it's the inbox beat of the demo.

## Known risks & gotchas

- **Trial expiry Jul 8, 2026:** after expiry, multi-step Zaps and premium apps stop
  running. The app degrades gracefully (`zapier: "failed"` note; on-screen demo
  unaffected) but the inbox beat dies.
- **Content parity:** the on-screen package and the emailed draft are two independent
  Groq generations from the same fields — wording differs slightly. Expected.
- **Resend key scope:** must be Full access (see step 6).
- **Attachment URLs:** Resend cannot fetch auth-protected URLs (see step 6).
