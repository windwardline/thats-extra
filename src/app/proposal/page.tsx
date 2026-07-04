import type { Metadata } from "next";
import { DocSection, DocShell, SignatureBlock } from "@/components/doc";

export const metadata: Metadata = {
  title: "Proposal — That's Extra",
  description: "Consulting proposal template for implementing That's Extra.",
};

export default function ProposalPage() {
  return (
    <DocShell
      docType="Consulting Proposal"
      title="Change Order Automation for Windward Electric Co."
      subtitle="Prepared by That's Extra for Windward Electric Co. — capturing, documenting, and recovering the cost of extra work across all active projects."
    >
      <DocSection number="1" title="Executive Summary">
        <p>
          Windward Electric Co. performs extra work on nearly every active project — relocated
          fixtures, rerouted feeders, added circuits, revised layouts. Most of it is real,
          billable scope change. Not all of it gets billed. This proposal implements
          That&apos;s Extra: an automated field-to-office workflow that turns a two-minute
          foreman&apos;s report into a professional, documented change request in the project
          manager&apos;s inbox the same day.
        </p>
        <p>
          The engagement is two weeks, fixed price, and includes the configured automation, a
          branded change request template, team training, and thirty days of post-launch tuning.
        </p>
      </DocSection>

      <DocSection number="2" title="Business Problem">
        <p>
          Industry experience across specialty trades puts undocumented extra work at{" "}
          <strong>3–5% of annual contract value</strong>. The pattern is consistent: the work is
          performed, the material is consumed, and the documentation trail dies in a text thread
          or on a foreman&apos;s phone.
        </p>
        <p>
          Against Windward&apos;s approximately <strong>$2.4M in annual contract volume</strong>,
          that range represents <strong>$72,000–$120,000 per year</strong> in performed-but-unbilled
          work. Recovering even half of it pays for this engagement many times over in the first
          quarter.
        </p>
      </DocSection>

      <DocSection number="3" title="Proposed Solution">
        <p>
          That&apos;s Extra connects three pieces Windward already understands: a structured field
          report any foreman can complete on a phone, a Zapier automation that processes each
          submission the moment it arrives, and an AI drafting step that produces a complete,
          professional change request package — executive summary, condition, impacts, a
          customer-facing request, and a ready-to-send PM email.
        </p>
        <p>
          Every submission is also logged to a running record, giving Windward a project-by-project
          view of extras requested, approved, and outstanding.
        </p>
      </DocSection>

      <DocSection number="4" title="Deliverables">
        <ul className="list-disc space-y-2 pl-5">
          <li>Configured field-report-to-change-request workflow (Zapier + OpenAI), live in Windward&apos;s accounts</li>
          <li>Branded change request template (Google Doc + PDF export)</li>
          <li>Field report form tailored to Windward&apos;s trades and change types</li>
          <li>Stored-record log with per-project reporting</li>
          <li>Training for foremen (capture) and PMs (review-and-send), with quick-reference guides</li>
          <li>Thirty days of post-launch tuning of prompts, templates, and routing</li>
        </ul>
      </DocSection>

      <DocSection number="5" title="Timeline">
        <p>
          <strong>Week 1 — Discovery &amp; configuration.</strong>{" "}Map Windward&apos;s current
          change order flow, configure the form, automation, template, and log; dry-run with
          historical examples.
        </p>
        <p>
          <strong>Week 2 — Pilot &amp; training.</strong>{" "}Live pilot on two active projects,
          foreman and PM training sessions, adjustments from pilot feedback, go-live.
        </p>
      </DocSection>

      <DocSection number="6" title="Pricing">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Implementation: $4,800</strong> — fixed price for the full two-week
            engagement and all deliverables above
          </li>
          <li>
            <strong>Platform: $349/month</strong> — automation hosting, AI drafting, template
            updates, and support (first invoice at go-live)
          </li>
        </ul>
        <p>
          <strong>30-day satisfaction guarantee:</strong> if Windward is not satisfied within
          thirty days of go-live, the platform fee is refunded and the workflow is decommissioned
          with all data exported to Windward.
        </p>
      </DocSection>

      <DocSection number="7" title="Implementation Process">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Kickoff and discovery walkthrough with ops and PM leads</li>
          <li>Workflow configuration in Windward-owned accounts (Zapier, OpenAI, Google)</li>
          <li>Template and form review with one revision round</li>
          <li>Two-project live pilot with daily check-ins</li>
          <li>Training, go-live, and transition to the 30-day tuning period</li>
        </ol>
      </DocSection>

      <DocSection number="8" title="Acceptance">
        <p>
          Signature below constitutes acceptance of this proposal and authorization to begin the
          engagement described above.
        </p>
        <SignatureBlock
          parties={[
            { role: "Client", org: "Windward Electric Co." },
            { role: "Provider", org: "That's Extra" },
          ]}
        />
      </DocSection>
    </DocShell>
  );
}
