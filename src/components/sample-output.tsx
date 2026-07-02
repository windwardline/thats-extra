"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ChangeRequestPackage, GenerateResponse } from "@/lib/schema";
import { Badge } from "@/components/ui";

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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="print-hidden inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-utility text-[11px] text-fog transition-colors hover:border-fog hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
    >
      {copied ? <Check className="size-3 text-amber" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

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
        {source === "openai" ? (
          <Badge tone="amber">Live AI</Badge>
        ) : (
          <Badge title="Set OPENAI_API_KEY to generate live.">Sample Mode</Badge>
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
