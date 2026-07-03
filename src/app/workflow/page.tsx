import type { Metadata } from "next";
import { KeyRound, ListChecks } from "lucide-react";
import { Badge, Card, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "How It Works — That's Extra",
  description:
    "The Zapier automation, end to end: one Zap, six steps, from field report to stored change request.",
};

type ZapStep = {
  app: string;
  title: string;
  what: string;
  why: string;
  consumes: string;
  produces: string;
  credential?: string;
};

const ZAP_STEPS: ZapStep[] = [
  {
    app: "Zapier Webhooks / Forms",
    title: "Trigger — New form submission",
    what: "The Zap fires the moment a foreman submits a field report. No polling, no batch jobs — the submission is the starting gun.",
    why: "The whole system depends on capture happening while the foreman is still standing in the affected area. The trigger costs the field zero extra effort.",
    consumes: "The twelve field report fields, straight from the form.",
    produces: "A raw submission record handed to the next step.",
    credential: "ZAPIER_WEBHOOK_URL",
  },
  {
    app: "Zapier Formatter",
    title: "Formatter — Clean the inputs",
    what: "Trims stray whitespace, normalizes the trade and urgency labels, and splits the submitter's name from their role.",
    why: "Field data arrives the way field data arrives. Thirty seconds of formatting here saves the AI step from guessing and keeps the document professional.",
    consumes: "The raw submission record.",
    produces: "Clean, consistently-labeled fields.",
  },
  {
    app: "OpenAI-compatible AI (Groq)",
    title: "AI — Draft the change request",
    what: "A structured prompt hands the cleaned report to an OpenAI-compatible model (gpt-oss-120b on Groq, JSON output) and asks for the full ten-section change request package: title, summary, conditions, impacts, next step, customer-facing request, and PM email draft.",
    why: "This is the ninety seconds that used to be a PM's Thursday night. Field shorthand goes in; a document you'd proudly send comes out.",
    consumes: "Clean field report fields.",
    produces: "The ten-section change request package as structured JSON.",
    credential: "GROQ_API_KEY",
  },
  {
    app: "Google Docs",
    title: "Create Google Doc / PDF",
    what: "Renders the package into a branded change request document in Drive, with a PDF export alongside the editable doc.",
    why: "GCs sign PDFs, not text messages. The document keeps every change request looking like it came from the same professional company — because it did.",
    consumes: "The change request package.",
    produces: "A branded Google Doc and PDF.",
    credential: "Google OAuth connection",
  },
  {
    app: "Resend",
    title: "Email the Project Manager",
    what: "Sends the drafted email from the company's own domain to the PM address on the field report. The PM reviews, adjusts if needed, and forwards to the GC.",
    why: "The PM stays in control of what the customer sees, but starts from a finished draft instead of a blank page and a text thread.",
    consumes: "The email draft and the PM's address.",
    produces: "A change request in the PM's inbox, same day.",
    credential: "RESEND_API_KEY",
  },
  {
    app: "Google Sheets",
    title: "Store the record",
    what: "Appends the full report and generated package to a running log — one row per extra, with project, trade, impacts, and status.",
    why: "One extra is an annoyance. Ninety extras across twenty jobs is a negotiation position. The log is where recovered revenue becomes visible.",
    consumes: "The complete report + package.",
    produces: "A permanent, reportable record.",
    credential: "Storage connection + table",
  },
];

const DAY_ONE = [
  "A Zapier account (the whole Zap is six steps — Starter plan covers it)",
  "The field report form (Zapier Forms, Typeform, or this app's own /demo form)",
  "An OpenAI-compatible API key for the drafting step (Groq's free tier works)",
  "A Google account for the document and the running log",
  "A Resend account (or any email provider) to send from the company's domain",
];

export default function WorkflowPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="py-16 lg:py-20">
          <SectionHeading
            eyebrow="How It Works"
            title="The Automation, End to End."
            lede="One Zap, six steps, zero heroics. Here's every step, what it consumes, what it produces, and where the credentials go."
          />
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 lg:py-20">
          <div className="space-y-6">
            {ZAP_STEPS.map((step, i) => (
              <Reveal key={step.title}>
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <span className="font-utility text-xs text-fog">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-utility text-xs uppercase tracking-wider text-fog">
                          {step.app}
                        </p>
                        <h2 className="mt-1 font-display text-lg font-semibold text-white">
                          {step.title}
                        </h2>
                      </div>
                    </div>
                    {step.credential ? (
                      <Badge tone="amber">
                        <KeyRound className="size-3" aria-hidden />
                        {step.credential}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="font-utility text-xs uppercase tracking-wider text-amber">
                          What it does
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-bright">{step.what}</p>
                      </div>
                      <div>
                        <p className="font-utility text-xs uppercase tracking-wider text-amber">
                          Why it exists
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-fog">{step.why}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-utility text-xs uppercase tracking-wider text-amber">
                          Consumes
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-fog">{step.consumes}</p>
                      </div>
                      <div>
                        <p className="font-utility text-xs uppercase tracking-wider text-amber">
                          Produces
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-fog">{step.produces}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 lg:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Getting Started"
              title="What you'd connect on day one."
            />
            <ul className="mt-8 max-w-2xl space-y-3">
              {DAY_ONE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ListChecks className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
                  <span className="text-base text-bright">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-2xl rounded-lg border border-line bg-surface p-5 text-sm leading-relaxed text-fog">
              <span className="font-semibold text-bright">Note for the demo:</span> the{" "}
              <code className="font-utility text-amber">/demo</code> form on this site is wired
              to a live version of this exact Zap — submitting it really does create the doc,
              email the PM, and append the log row. The app&apos;s own{" "}
              <code className="font-utility text-amber">/api/generate</code> route still mirrors
              step 3, so the on-screen result renders even if the automation is offline.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
