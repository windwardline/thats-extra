import {
  BadgeDollarSign,
  CalendarClock,
  FileCheck2,
  Handshake,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Button, Card, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { WorkflowDiagram } from "@/components/workflow-diagram";
import { SampleOutput } from "@/components/sample-output";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";
import { generateSamplePackage } from "@/lib/generator";

const HERO_STEPS = [
  { label: "Foreman" },
  { label: "Photos + Notes" },
  { label: "Zapier Automation" },
  { label: "AI" },
  { label: "Professional Change Request" },
  { label: "Project Manager" },
  { label: "Recovered Revenue", accent: true },
];

const AUTOMATION_STEPS = [
  { label: "Field Report" },
  { label: "Zapier" },
  { label: "AI Processing" },
  { label: "Professional Change Request" },
  { label: "Email Project Manager" },
  { label: "Stored Record", accent: true },
];

const QUOTES = [
  "“Can you just move those outlets?”",
  "“Can you just shift this duct?”",
  "“Can you just add one more receptacle?”",
  "“While you're here…”",
];

const COST_CHAIN = [
  "Nobody writes it down.",
  "The photos live and die on the foreman's phone.",
  "The labor hours evaporate from memory by Friday.",
  "The material came off the truck, so it must have been free.",
  "The PM reconstructs the whole thing three days later from a text thread.",
  "The change request becomes an afterthought.",
  "Extra work quietly becomes free work.",
];

const SOLUTION_STEPS = [
  {
    label: "Foreman submits a field report",
    detail: "Two minutes on a phone, standing in the affected area. No laptop, no login hunt.",
  },
  {
    label: "Photos and notes are uploaded",
    detail: "The evidence leaves the phone while the dust is still settling.",
  },
  {
    label: "Zapier processes the submission",
    detail: "The automation picks it up instantly. Nobody has to remember to do anything.",
  },
  {
    label: "AI drafts a professional change request",
    detail: "Field shorthand goes in. A document you'd proudly sign comes out.",
  },
  {
    label: "PM receives polished documentation",
    detail: "In their inbox before the GC's superintendent finishes their coffee.",
  },
  {
    label: "Record is stored for future reporting",
    detail: "Every extra, logged. Ammunition for the next contract negotiation.",
    accent: true,
  },
];

const BENEFITS = [
  {
    icon: BadgeDollarSign,
    title: "Recover lost revenue",
    copy: "The work you already did, the material you already bought — captured and billed instead of donated.",
  },
  {
    icon: Timer,
    title: "Cut PM admin time",
    copy: "Your PMs stop playing archaeologist with week-old text threads and get back to running jobs.",
  },
  {
    icon: FileCheck2,
    title: "Field docs that hold up",
    copy: "Photos, impacts, and dates captured on the spot — documentation that survives a dispute.",
  },
  {
    icon: CalendarClock,
    title: "Same-day response",
    copy: "Change requests go out while the request is still fresh in everyone's memory, not three weeks later.",
  },
  {
    icon: Handshake,
    title: "Customers trust paper, not memory",
    copy: "GCs approve documented, professional requests. They argue with verbal ones.",
  },
  {
    icon: ShieldCheck,
    title: "Margins that survive the punch list",
    copy: "The job you bid is the job you bill. Extras stay extra, all the way to closeout.",
  },
];

export default function Home() {
  const pkg = generateSamplePackage(MIDTOWN_SCENARIO);

  return (
    <>
      {/* 1 — Hero */}
      <section className="border-b border-line">
        <Container className="grid gap-14 py-20 lg:grid-cols-[3fr_2fr] lg:items-center lg:py-28">
          <div>
            <p className="font-utility text-xs uppercase tracking-[0.2em] text-amber">
              Margin Recovery for Specialty Trades
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Every &ldquo;Can You Just...&rdquo; Should Come With a Change Order.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fog">
              That&apos;s Extra turns field notes, photos, labor impacts, and material costs
              into professional change requests before extra work becomes lost profit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/demo">Demo the Workflow</Button>
              <Button href="/demo?sample=1" variant="ghost">
                Generate a Sample Change Request
              </Button>
            </div>
          </div>
          <Card className="lg:justify-self-end">
            <p className="mb-5 font-utility text-xs uppercase tracking-[0.2em] text-fog">
              How the money gets home
            </p>
            <WorkflowDiagram steps={HERO_STEPS} />
          </Card>
        </Container>
      </section>

      {/* 2 — Problem */}
      <section className="border-b border-line">
        <Container className="py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="The Problem"
              title="The Most Expensive Words on a Jobsite."
              lede="They never sound expensive. That's the trick."
            />
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap gap-3">
            {QUOTES.map((quote) => (
              <span
                key={quote}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-bright"
              >
                {quote}
              </span>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <ol className="max-w-2xl space-y-3">
              {COST_CHAIN.map((line, i) => (
                <li key={line} className="flex items-baseline gap-4">
                  <span className="font-utility text-xs text-fog">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base text-bright">{line}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-2xl border-l-2 border-amber pl-5 text-lg font-medium leading-relaxed text-white">
              You did the work. You bought the material. You even stayed late. The only thing
              you didn&apos;t do was get paid.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 3 — Solution */}
      <section className="border-b border-line bg-surface/40">
        <Container className="py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="The Fix"
              title="From &ldquo;can you just&rdquo; to &ldquo;sign right here.&rdquo;"
              lede="Six steps between the request and the recovered dollar. Your crew touches exactly one of them."
            />
          </Reveal>
          <Reveal className="mt-12 max-w-2xl">
            <WorkflowDiagram steps={SOLUTION_STEPS} />
          </Reveal>
        </Container>
      </section>

      {/* 4 — Automation strip */}
      <section className="border-b border-line">
        <Container className="py-16 lg:py-20">
          <Reveal>
            <WorkflowDiagram steps={AUTOMATION_STEPS} orientation="horizontal" />
            <p className="mt-8 font-utility text-xs uppercase tracking-[0.2em] text-fog">
              Thirty seconds to understand. Ninety seconds to run.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 5 — Demo scenario */}
      <section className="border-b border-line bg-surface/40">
        <Container className="py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="See It Work"
              title="One revised ceiling plan. Twelve relocated fixtures. Zero lost dollars."
              lede={`${MIDTOWN_SCENARIO.companyName} gets a revised RCP after rough-in on the ${MIDTOWN_SCENARIO.projectName}. Here's the field report — and the package the automation sends back.`}
            />
          </Reveal>
          <Reveal className="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
            <Card className="h-fit">
              <p className="font-utility text-xs uppercase tracking-[0.2em] text-fog">
                Field Report — {MIDTOWN_SCENARIO.submittedBy}
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-utility text-xs uppercase tracking-wider text-amber">Condition</dt>
                  <dd className="mt-1 leading-relaxed text-bright">{MIDTOWN_SCENARIO.description}</dd>
                </div>
                <div>
                  <dt className="font-utility text-xs uppercase tracking-wider text-amber">Labor</dt>
                  <dd className="mt-1 leading-relaxed text-bright">{MIDTOWN_SCENARIO.laborImpact}</dd>
                </div>
                <div>
                  <dt className="font-utility text-xs uppercase tracking-wider text-amber">Material</dt>
                  <dd className="mt-1 leading-relaxed text-bright">{MIDTOWN_SCENARIO.materialImpact}</dd>
                </div>
                <div>
                  <dt className="font-utility text-xs uppercase tracking-wider text-amber">Urgency</dt>
                  <dd className="mt-1 text-bright">{MIDTOWN_SCENARIO.urgency}</dd>
                </div>
              </dl>
            </Card>
            <div>
              <SampleOutput pkg={pkg} source="sample" />
              <p className="mt-4 text-right">
                <a
                  href="/demo?sample=1"
                  className="text-sm font-medium text-amber transition-colors hover:text-amber-deep"
                >
                  Run it yourself →
                </a>
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 6 — Benefits */}
      <section className="border-b border-line">
        <Container className="py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Why It Pays"
              title="Built for the people who actually build things."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <Reveal key={benefit.title}>
                <Card className="h-full">
                  <benefit.icon className="size-5 text-amber" aria-hidden />
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{benefit.copy}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 7 — CTA band */}
      <section>
        <Container className="py-20 text-center lg:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The next &ldquo;can you just...&rdquo; is coming. Be ready for it.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/demo">Demo the Workflow</Button>
              <Button href="/demo?sample=1" variant="ghost">
                Generate a Sample Change Request
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
