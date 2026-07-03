# That's Extra — Original Project Brief (verbatim)

**Date:** 2026-07-02
**Status:** Source of truth for all copy marked "verbatim from brief" in the plan.
**Note:** This is Michael's initial prompt, preserved in full so design intent survives
session interruptions. The approved design spec and implementation plan derive from it.

---

I am building an AI development class project in Claude Code CLI inside VS Code.

My instructor gave the following guidance, which should act as the north star for this project and should influence every design and implementation decision:

"Phase 3 Presentations Guideline for Monday

Pitch an automation solution to a problem.
A real problem of a real friend, family member, or client
OR a hypothetical client with a hypothetical problem

Landing page for the product/tool/solution
Should include positioning, headline, value prop, CTA, any visual aid that helps.

Demo the automation via sharing your workflow or running through your deployed link.

Written
Proposal template for this product
Contract template for client"

# PROJECT

Build a polished SaaS-style web application for an AI-powered margin recovery platform designed specifically for specialty-trade subcontractors.

This should feel like a real startup, not a class assignment.

The final product should be polished enough that someone could reasonably believe it is an early-stage SaaS product preparing for investor meetings and customer demonstrations.

Product Name:

That's Extra

Tagline:

Every "Can You Just..." Has a Price.

---

# THE BUSINESS PROBLEM

Commercial electrical and HVAC subcontractors lose thousands of dollars because extra work happens every day on jobsites, but it rarely gets documented quickly or professionally enough to become an approved change order.

Every subcontractor has heard it:

"Can you just move these fixtures?"

"Can you just reroute this conduit?"

"Can you just shift this duct?"

"Can you just add another receptacle?"

"While you're here..."

Those simple requests often become:

- undocumented labor
- additional material costs
- equipment usage
- schedule impacts
- rework
- vague text messages
- photos trapped on phones
- forgotten conversations
- lost revenue

The work gets done.

The paperwork doesn't.

The contractor eats the cost.

That's Extra exists to stop that from happening.

---

# CORE PROMISE

Every "Can You Just..." should come with a change order.

That's Extra helps contractors capture field evidence, organize project impacts, and automatically generate professional change requests before forgotten work becomes lost profit.

---

# TARGET CUSTOMER

Commercial electrical and HVAC subcontractors.

Typical company size:

- 10–75 field employees
- 20–100 active jobs

Primary users:

- Owners
- Project Managers
- Operations Managers
- Foremen

---

# BUILD REQUIREMENTS

Create a polished, presentation-ready SaaS application that includes:

1. Modern landing page
2. Interactive demo form
3. Automation workflow visualization
4. AI-generated sample change request
5. Proposal template
6. Client contract template
7. Responsive design
8. Deployable application on Vercel

The automation must be designed around Zapier.

Use placeholder integrations where credentials or API keys are required.

---

# TECHNOLOGY STACK

Preferred stack:

- Next.js
- TypeScript
- Tailwind CSS
- Vercel
- Zapier
- OpenAI
- Optional Supabase integration if useful

Follow current best practices and maintain clean project architecture.

---

# BRAND PERSONALITY

The brand should feel like it was created by someone who has spent years working with subcontractors and understands exactly how jobsites operate.

The personality should be witty, confident, relatable, and self-aware without becoming cheesy or unprofessional.

Think of the brand voice as a combination of Basecamp, Morning Brew, and Liquid Death—professional products with distinct personalities.

The humor should come from shared industry experiences, not from mocking contractors.

Every contractor visiting the site should smile and think:

"Yep...that's exactly what happens."

The product should feel like it's on the contractor's side.

---

# LANDING PAGE

## Hero

Headline:

Every "Can You Just..." Should Come With a Change Order.

Subheadline:

That's Extra turns field notes, photos, labor impacts, and material costs into professional change requests before extra work becomes lost profit.

Primary CTA:

Demo the Workflow

Secondary CTA:

Generate a Sample Change Request

Create a modern SaaS hero section with a premium feel.

Include a visual workflow illustration:

Foreman

↓

Photos + Notes

↓

Zapier Automation

↓

AI

↓

Professional Change Request

↓

Project Manager

↓

Recovered Revenue

---

## Problem Section

Title:

The Most Expensive Words on a Jobsite

Open with familiar requests like:

"Can you just move those outlets?"

"Can you just shift this duct?"

"While you're here..."

Then explain why these innocent requests become expensive:

- Nobody writes them down.
- Photos stay on phones.
- Labor impacts are forgotten.
- Materials never get tracked.
- PMs reconstruct everything days later.
- Change requests become afterthoughts.
- Extra work quietly becomes free work.

Include tasteful copy that makes contractors laugh because it's true.

---

## Solution Section

Explain how That's Extra works.

1. Foreman submits a field report.
2. Photos and notes are uploaded.
3. Zapier processes the submission.
4. AI drafts a professional change request.
5. PM receives polished documentation.
6. Record is stored for future reporting.

Focus on simplicity and speed.

---

## Automation Workflow

Show a clean visual workflow:

Field Report

↓

Zapier

↓

AI Processing

↓

Professional Change Request

↓

Email Project Manager

↓

Stored Record

This section should visually explain the automation in less than 30 seconds.

---

## Demo Scenario

Use a fictional commercial electrical subcontractor.

Project:

Midtown Office Renovation

Situation:

The general contractor issued a revised reflected ceiling plan requiring twelve light fixtures to be relocated after rough-in.

Impact:

- Two electricians
- Six labor hours
- Lift rental
- Additional wire
- Additional connectors
- Testing and commissioning

Generate realistic AI output including:

- Change Request Title
- Executive Summary
- Existing Condition
- Requested Change
- Labor Impact
- Material Impact
- Schedule Impact
- Recommended Next Step
- Customer-Facing Change Request
- Email Draft to the Project Manager

The output should look like something a real subcontractor would actually send.

---

## Demo Form

Create a realistic field report form.

Fields:

- Company Name
- Project Name
- Submitted By
- Trade (Electrical or HVAC)
- Change Type
- Description of Changed Condition
- Labor Impact
- Material Impact
- Schedule Impact
- Urgency
- Requested Next Step
- Project Manager Email

The form should feel production-ready.

---

## Business Benefits

Highlight measurable value.

Recover lost revenue.

Reduce PM administrative work.

Improve field documentation.

Respond faster.

Strengthen customer communication.

Protect project margins.

Use clean cards with icons and concise copy.

---

## Proposal Template

Create a professional consulting proposal for implementing That's Extra.

Include:

- Executive Summary
- Business Problem
- Proposed Solution
- Deliverables
- Timeline
- Pricing
- Implementation Process
- Acceptance

This should be something I could actually send to a customer.

---

## Client Contract Template

Create a professional services agreement.

Include:

- Scope of Services
- Client Responsibilities
- Fees
- Payment Terms
- Intellectual Property
- Confidentiality
- Support
- Warranty Disclaimer
- Termination
- Signature Page

Keep it concise but realistic.

---

# ZAPIER AUTOMATION

Design the automation so it can be demonstrated live.

Trigger:

New form submission

↓

Formatter

↓

OpenAI

↓

Generate professional change request

↓

Create Google Doc or PDF

↓

Email Project Manager

↓

Save record in Supabase, Google Sheets, or Airtable

Use placeholders wherever credentials are required.

Also create a page explaining the Zapier workflow so I can present it during the demo.

---

# DESIGN DIRECTION

This should resemble a premium B2B SaaS product.

Avoid stereotypical construction website aesthetics.

Instead, prioritize:

- Excellent typography
- Strong visual hierarchy
- Clean spacing
- Premium SaaS UI
- Responsive layout
- Subtle animations
- Modern cards
- Professional iconography
- Construction-tech aesthetic
- Accessible design

The site should feel fast, modern, polished, and credible.

---

# DELIVERABLES

Produce:

- Complete Next.js application
- Responsive landing page
- Interactive demo form
- Workflow visualization
- AI-generated sample change request
- Proposal template
- Client services agreement
- Zapier workflow documentation
- README with architecture, setup, deployment instructions, and presentation notes

Begin by designing the project architecture and file structure.

Then build the landing page first, followed by the demo workflow, proposal template, contract template, and supporting documentation.

Optimize every decision for a polished classroom presentation that demonstrates a real automation solving a real business problem. The audience should leave thinking, "I can absolutely see contractors paying for this."
