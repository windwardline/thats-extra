import type { ChangeRequestPackage, GenerateResponse } from "@/lib/schema";
import { Badge } from "@/components/ui";
import { CopyButton } from "@/components/copy-button";

const SECTIONS: { key: keyof ChangeRequestPackage; label: string; mono?: boolean }[] = [
  { key: "executiveSummary", label: "Executive Summary" },
  { key: "existingCondition", label: "Existing Condition" },
  { key: "requestedChange", label: "Requested Change" },
  { key: "laborImpact", label: "Labor Impact" },
  { key: "materialImpact", label: "Material Impact" },
  { key: "scheduleImpact", label: "Schedule Impact" },
  { key: "recommendedNextStep", label: "Recommended Next Step" },
  { key: "customerFacingRequest", label: "Customer-Facing Change Request" },
  { key: "emailDraft", label: "Email Draft to the Project Manager", mono: true },
];

/**
 * Shared component: renders server-side on the landing page and inside the
 * client demo form. Only CopyButton is a client island.
 */
export function SampleOutput({
  pkg,
  source,
}: {
  pkg: ChangeRequestPackage;
  source: GenerateResponse["source"];
}) {
  return (
    <div className="print-reset rounded-lg border border-line bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line p-6">
        <div>
          <p className="font-utility text-xs uppercase tracking-[0.2em] text-fog">
            Change Request Package
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold text-white">{pkg.title}</h3>
        </div>
        {source === "groq" ? (
          <Badge tone="amber">Live AI</Badge>
        ) : (
          <Badge title="Set GROQ_API_KEY to generate live.">Sample Mode</Badge>
        )}
      </div>
      <dl className="divide-y divide-line">
        {SECTIONS.map((section) => (
          <div key={section.key} className="p-6">
            <div className="flex items-center justify-between gap-3">
              <dt className="font-utility text-xs uppercase tracking-wider text-amber">
                {section.label}
              </dt>
              <CopyButton text={pkg[section.key]} label={section.label} />
            </div>
            <dd
              className={`mt-3 whitespace-pre-line text-sm leading-relaxed text-bright ${
                section.mono ? "font-utility text-[13px]" : ""
              }`}
            >
              {pkg[section.key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
