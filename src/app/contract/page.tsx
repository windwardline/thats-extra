import type { Metadata } from "next";
import { DocSection, DocShell, SignatureBlock } from "@/components/doc";

export const metadata: Metadata = {
  title: "Contract — That's Extra",
  description: "Professional services agreement template for That's Extra engagements.",
};

export default function ContractPage() {
  return (
    <DocShell
      docType="Professional Services Agreement"
      title="Professional Services Agreement"
      subtitle="Between That's Extra (“Provider”) and the undersigned client (“Client”), effective as of the date of the last signature below."
      note="Template for demonstration — have your attorney review before use."
    >
      <DocSection number="1" title="Scope of Services">
        <p>
          Provider will implement and operate the That&apos;s Extra change request automation
          for Client, consisting of: a structured field report intake, an automated processing
          workflow (Zapier), AI-assisted drafting of change request packages, document and
          email delivery to Client&apos;s designated project managers, and a stored record of
          all submissions. Specific deliverables, timeline, and pilot scope are described in the
          accepted Proposal, which is incorporated by reference.
        </p>
      </DocSection>

      <DocSection number="2" title="Client Responsibilities">
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide access to the accounts the workflow runs in (Zapier, OpenAI, Google, storage) or authorize Provider to create them on Client&apos;s behalf</li>
          <li>Designate a project lead with authority to make configuration decisions</li>
          <li>Make foremen and project managers available for the training sessions</li>
          <li>Review AI-generated drafts before sending them to customers (see Section 8)</li>
          <li>Pay undisputed invoices per Section 4</li>
        </ul>
      </DocSection>

      <DocSection number="3" title="Fees">
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Implementation fee:</strong>{" "}$4,800, fixed price, covering the deliverables in the accepted Proposal</li>
          <li><strong>Platform fee:</strong>{" "}$349 per month, covering automation hosting, AI drafting, template updates, and support</li>
        </ul>
      </DocSection>

      <DocSection number="4" title="Payment Terms">
        <p>
          Fifty percent (50%) of the implementation fee is due on signing; the remaining fifty
          percent (50%) is due at go-live. Invoices are payable net 15. The monthly platform fee
          begins at go-live and is billed monthly on the go-live anniversary date.
        </p>
      </DocSection>

      <DocSection number="5" title="Intellectual Property">
        <p>
          Provider retains all right, title, and interest in the That&apos;s Extra platform,
          workflow designs, prompts, and templates. Client owns its data — all field reports,
          photos, and generated change request documents — and may export it at any time.
          Nothing in this Agreement transfers ownership of either party&apos;s pre-existing
          intellectual property.
        </p>
      </DocSection>

      <DocSection number="6" title="Confidentiality">
        <p>
          Each party will protect the other&apos;s non-public business information with at least
          the care it uses for its own, and will use it only to perform under this Agreement.
          This obligation survives termination for two (2) years. Client project data is never
          used to train models or shared with third parties beyond the services configured in
          the workflow.
        </p>
      </DocSection>

      <DocSection number="7" title="Support">
        <p>
          Provider offers support by email during normal business hours (Monday–Friday,
          8am–6pm Eastern, excluding holidays) with a response target of one (1) business day.
          Support covers workflow operation, template adjustments, and delivery issues.
        </p>
      </DocSection>

      <DocSection number="8" title="Warranty Disclaimer">
        <p>
          The services and all AI-generated documents are provided <strong>as is</strong>.
          Provider does not warrant that generated drafts are error-free or fit for any
          particular contractual purpose. <strong>In plain English:</strong>{" "}the AI writes a
          strong first draft — it is a draft, not legal or contractual advice. Client is
          responsible for reviewing every generated document before sending it to a customer,
          and for the accuracy of the field information submitted.
        </p>
      </DocSection>

      <DocSection number="9" title="Termination">
        <p>
          Either party may terminate this Agreement with thirty (30) days&apos; written notice.
          On termination, Provider will deliver a complete export of Client&apos;s data in
          standard formats within ten (10) business days, and Client will pay for services
          rendered through the termination date. Sections 5, 6, and 8 survive termination.
        </p>
      </DocSection>

      <DocSection number="10" title="Signatures">
        <p>
          Executed by the duly authorized representatives of the parties as of the dates below.
        </p>
        <SignatureBlock
          parties={[
            { role: "Provider", org: "That's Extra" },
            { role: "Client", org: "Company: ________________________" },
          ]}
        />
      </DocSection>
    </DocShell>
  );
}
