# That's Extra — Phase 3 Presentation Script (5:00)

Built to the Phase 3 guideline, in the order the rubric lists it:
**(1)** pitch an automation solution to a problem (hypothetical client),
**(2)** landing page — positioning, headline, value prop, CTA, visual aid,
**(3)** demo the automation — workflow *and* the deployed link,
**(4)** written deliverables — proposal template and contract template.

## Before class (10 minutes, do it in this order)

1. **Open five tabs, in presentation order, and leave them open:**
   - Tab 1: https://thatsextra.windwardline.com (landing)
   - Tab 2: https://thatsextra.windwardline.com/workflow (automation)
   - Tab 3: https://thatsextra.windwardline.com/demo?sample=1 (live demo)
   - Tab 4: pm@windwardline.com inbox (the PM's mailbox — the real-time email beat)
   - Tab 5: https://thatsextra.windwardline.com/proposal (written deliverables)
2. **Dry-fire the demo once from Tab 3** — hit *Generate Change Request*, confirm the
   amber **Live AI** badge appears (~3 seconds). This also warms the serverless function
   so the in-class run is fast.
3. **Check Tab 4:** the dry-fire email should land in the **Inbox** (DMARC is set on the
   domain). If it's in Junk anyway, mark it **Not Junk** now — that trains the mailbox
   before the run that matters. Confirm the body starts with the greeting, not a
   Subject line (Zap v2).
4. Set your browser to **full screen** (hide bookmarks bar), zoom ~110% if projecting.
5. Close Slack/notifications. Charge the laptop.
6. **If the room Wi-Fi is questionable:** tether to your phone. And remember — if the AI
   call fails for any reason, the app automatically falls back to Sample Mode and
   *labels itself honestly*. That's not a failure, it's a talking point (line included below).

**Timekeeping anchors:** be leaving the landing page by 1:30, clicking Generate by 2:30,
on the proposal by 3:45.

---

## The script

### [0:00 — Tab 1, but don't touch it yet. Face the room.] — The Problem & the Client (45 sec)

*Rubric: pitch an automation solution to a problem — hypothetical client, hypothetical problem.*

> Every commercial subcontractor knows the most expensive words on a jobsite: **"Can you just..."** Can you just move those outlets. Can you just shift this duct. While you're here...
>
> My client — Windward Electric, a commercial electrical sub with about forty field employees — does that extra work every single day. The work gets done. The paperwork doesn't. The foreman's photos die on his phone, the labor hours evaporate by Friday, and the change request becomes an afterthought. Industry-wide, that's three to five percent of contract value — for Windward, **$72,000 to $120,000 a year in work they did but never billed.**
>
> I built them an automation that fixes it. It's called **That's Extra.**

### [0:45 — Turn to screen, scroll Tab 1 slowly] — The Landing Page (45 sec)

*Rubric: positioning, headline, value prop, CTA, visual aid — point at each one as you say it.*

> Here's the product. The positioning is one sentence — *(point at the headline)* — **"Every 'can you just' should come with a change order."** The value prop right under it: That's Extra turns field notes, photos, labor impacts, and material costs into professional change requests **before extra work becomes lost profit.** The buttons are the calls to action — try the demo, see the workflow.
>
> *(Point at the diagram on the right — the visual aid.)* This is the whole system in one picture: foreman → photos and notes → Zapier → AI → a professional change request → the project manager → recovered revenue.
>
> *(Scroll briefly through the problem section — pause one beat on the quote chips so they get a laugh — then stop scrolling.)* Every contractor who sees this page says the same thing: "yep, that's exactly what happens."

### [1:30 — Tab 2, scroll as you talk] — The Automation Workflow (45 sec)

*Rubric: demo the automation — sharing the workflow. The deployed-link half comes next.*

> Under the hood it's one Zapier workflow, six steps, and I can walk it end to end in thirty seconds. A form submission from the field **triggers** the Zap. A **formatter** cleans the inputs. **OpenAI-compatible AI** drafts the full change request package. It merges into a **branded Google Doc and PDF**, **emails the project manager from the company's own domain**, and **stores the record** — so at the end of the quarter, Windward can see every extra across every job. The amber chips are where the client's credentials plug in on day one — and this isn't a diagram of a hypothetical: the Zap you're looking at is live, and you'll watch it fire in a minute.

### [2:15 — Tab 3] — The Live Demo on the Deployed Link (75 sec — this is the money shot)

*Rubric: demo the automation — running through the deployed link.*

> Now watch it actually work. This is the field report a foreman fills out — two minutes, standing in the affected area. It's pre-loaded with a real scenario: the GC issued a revised ceiling plan *after* rough-in, and twelve light fixtures have to move. Two electricians, six hours, a lift rental.
>
> *(Click **Generate Change Request**. It lands in ~3 seconds.)*
>
> Three seconds. *(Scroll the output slowly.)* Executive summary. Existing condition. Requested change. Labor, material, and schedule impacts. A formal customer-facing change request ready to forward to the GC. And a **ready-to-send email to the project manager** — signed by the foreman who filed it. See the badge? **Live AI** — that was generated just now, from those exact inputs. The foreman files a two-minute report, and this document exists before he's back on the lift.
>
> *(Switch to Tab 4 — the PM inbox. The new email is at the top; refresh if it isn't yet.)* And while we were reading, the automation finished the rest of the job. The project manager just received this — sent from the company's own domain, straight to the inbox. *(Open it.)* Subject line, then the email starts like a person wrote it — greeting first, summary, impacts, signed by the foreman. Meanwhile the branded Google Doc is in Drive and the log picked up a new row. Nobody touched anything after the foreman hit submit.

**⚠️ If Wi-Fi dies:** the badge will say *Sample Mode* instead. Say this, with confidence:
> "Notice the badge says Sample Mode — the AI call couldn't get through the room's Wi-Fi, so the system fell back to its built-in generator and *told us the truth about it*. A field tool that dies on a jobsite with bad signal is a field tool nobody uses. This one degrades gracefully. That's a feature I designed in."

### [3:45 — Tab 5, scroll; click Contract in the nav halfway through] — The Written Deliverables (45 sec)

*Rubric: written — proposal template and contract template.*

> Selling this to a client takes paper, so both deliverables are built in. The **proposal**: the business problem quantified against Windward's actual volume, the solution, deliverables, a two-week timeline, and pricing — $4,800 implementation plus $349 a month, with a 30-day guarantee. *(Click **Contract** in the nav.)* And the **services agreement**: scope, payment terms, IP, confidentiality, and a plain-English warranty clause — the AI writes a strong first draft; a human reviews it before it goes to a customer. Both are print-ready — *(hover the Print/Save PDF button)* — one click and it's a client-ready PDF.

### [4:30 — Face the room] — Close (30 sec)

> So: a real problem — extra work becoming free work. A landing page that sells it, an automation that solves it in ninety seconds — you watched the email arrive — and the proposal and contract to close the deal. Windward recovers even half of what they're losing, this pays for itself **fifty times over in year one**.
>
> That's Extra. Because every "can you just..." has a price. Thank you.

---

## Rubric coverage (if the instructor asks where things are)

| Guideline requirement | Where you showed it |
|---|---|
| Pitch: automation solution to a problem (hypothetical client) | 0:00 open — Windward Electric, quantified problem |
| Landing page: positioning, headline, value prop, CTA, visual aid | 0:45 — each named and pointed at on screen |
| Demo: share your workflow | 1:30 — /workflow, the live six-step Zap |
| Demo: run through your deployed link | 2:15 — live generation on the deployed site + real email arriving |
| Written: proposal template | 3:45 — /proposal |
| Written: contract template | 3:45 — /contract |

## Likely Q&A (one-breath answers)

- **"Is that real AI?"** — Yes: Groq running `gpt-oss-120b`, called live through an OpenAI-compatible API; the badge reports the source honestly, and there's a deterministic fallback so the demo can't fail.
- **"Was that email real?"** — Yes: sent by the automation through Resend from the company's own domain, with SPF, DKIM, and DMARC set up so it lands in the inbox, not spam — that's part of the deliverable.
- **"What does it cost to run?"** — The AI inference for a change request is fractions of a cent; the $349/month covers hosting, drafting, templates, and support.
- **"Why Zapier instead of custom code?"** — The client can see, audit, and own every step; no developer needed to maintain it.
- **"What about photos?"** — Captured in the field report and attached to the stored record; out of scope for the demo but wired into the workflow design.
