import type { ChangeRequestPackage, FieldReport } from "@/lib/schema";

/**
 * Deterministic fallback generator. Produces a realistic change request
 * package from the actual field report — no network, no randomness, no
 * clock reads — so the demo works with no OPENAI_API_KEY and survives any
 * API failure. Same inputs always yield the same package.
 */

type TradeVoice = {
  /** How the discipline is named in formal documents. */
  discipline: string;
  /** What the crew is called. */
  crew: string;
  /** The scope noun for the affected work. */
  scope: string;
};

const TRADE_VOICE: Record<FieldReport["trade"], TradeVoice> = {
  Electrical: {
    discipline: "electrical",
    crew: "electricians",
    scope: "electrical installations",
  },
  HVAC: {
    discipline: "mechanical",
    crew: "sheet metal and mechanical technicians",
    scope: "mechanical and sheet metal installations",
  },
};

const URGENCY_WINDOW: Record<FieldReport["urgency"], string> = {
  Critical:
    "Given the critical urgency, we request written direction within 24 hours to avoid compounding labor and schedule impacts.",
  High: "Given the high urgency, we request written direction within two business days so the affected work can proceed without further impact.",
  Medium:
    "We request written direction within five business days so this work can be incorporated into the current schedule.",
  Low: "We request this item be addressed no later than the next scheduled progress meeting.",
};

function firstName(submittedBy: string): string {
  return submittedBy.split(",")[0].trim();
}

export function generateSamplePackage(report: FieldReport): ChangeRequestPackage {
  const voice = TRADE_VOICE[report.trade];
  const window = URGENCY_WINDOW[report.urgency];
  const author = firstName(report.submittedBy);

  const title = `Change Request — ${report.projectName}: ${report.changeType} Affecting ${voice.discipline.charAt(0).toUpperCase() + voice.discipline.slice(1)} Scope`;

  const executiveSummary = `${report.companyName} has identified a changed condition on the ${report.projectName} project that falls outside our contracted scope of work. The condition — categorized as ${report.changeType.toLowerCase()} — directly impacts labor, material, and schedule for our ${voice.discipline} scope. This change request documents the condition, quantifies the impacts as currently known, and requests written authorization before the affected work proceeds. Urgency is rated ${report.urgency}.`;

  const existingCondition = `Work in the affected area was installed per the contract documents in effect at the time of installation. ${report.description}`;

  const requestedChange = `${report.companyName} requests a change order covering the labor, material, equipment, and schedule impacts described below. The requested next step from the field is: ${report.requestedNextStep}`;

  const laborImpact = `${report.laborImpact} Crew composition and hours reflect the field supervisor's assessment at the time of this report; final hours will be reconciled on completion. All labor will be performed by qualified ${voice.crew} at contract rates.`;

  const materialImpact = `${report.materialImpact} Material quantities are based on field measurement and will be supported by supplier documentation upon request.`;

  const scheduleImpact = `${report.scheduleImpact} Schedule impacts assume authorization is received within the response window requested below; delayed direction may extend the impact.`;

  const recommendedNextStep = `${report.requestedNextStep} ${window}`;

  const customerFacingRequest = [
    `To the Project Team,`,
    ``,
    `${report.companyName} respectfully submits this change request for the ${report.projectName} project. A changed condition (${report.changeType.toLowerCase()}) has been identified that affects our ${voice.scope} beyond the contracted scope of work.`,
    ``,
    `Condition: ${report.description}`,
    ``,
    `Labor impact: ${report.laborImpact}`,
    ``,
    `Material and equipment impact: ${report.materialImpact}`,
    ``,
    `Schedule impact: ${report.scheduleImpact}`,
    ``,
    `${report.companyName} is prepared to proceed upon approval. ${window} We appreciate your prompt attention and are available to walk the affected area with the ${voice.discipline} scope drawings at your convenience.`,
  ].join("\n");

  const emailDraft = [
    `To: ${report.pmEmail}`,
    `Subject: Change Request — ${report.projectName} (${report.changeType})`,
    ``,
    `Hi,`,
    ``,
    `Attached is a change request for the ${report.projectName} project covering a ${report.changeType.toLowerCase()} that impacts our ${voice.discipline} scope.`,
    ``,
    `Quick summary: ${report.description}`,
    ``,
    `Labor: ${report.laborImpact}`,
    `Material: ${report.materialImpact}`,
    `Schedule: ${report.scheduleImpact}`,
    ``,
    `${window}`,
    ``,
    `Please review and let me know if you need anything else to process this. Photos and field notes are available on request.`,
    ``,
    `Thanks,`,
    `${author}`,
    `${report.companyName}`,
  ].join("\n");

  return {
    title,
    executiveSummary,
    existingCondition,
    requestedChange,
    laborImpact,
    materialImpact,
    scheduleImpact,
    recommendedNextStep,
    customerFacingRequest,
    emailDraft,
  };
}
