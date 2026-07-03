"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { buttonGhost, buttonPrimary } from "@/components/ui";
import {
  CHANGE_TYPES,
  TRADES,
  URGENCIES,
  fieldReportSchema,
  type FieldReport,
  type GenerateResponse,
} from "@/lib/schema";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";
import { SampleOutput } from "@/components/sample-output";

type FormValues = Record<keyof FieldReport, string>;

const EMPTY: FormValues = {
  companyName: "",
  projectName: "",
  submittedBy: "",
  trade: "Electrical",
  changeType: CHANGE_TYPES[0],
  description: "",
  laborImpact: "",
  materialImpact: "",
  scheduleImpact: "",
  urgency: "Medium",
  requestedNextStep: "",
  pmEmail: "",
};

const inputClass =
  "w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-bright placeholder:text-fog/60 focus:border-amber focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-utility text-xs uppercase tracking-wider text-fog">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-amber">{error}</span> : null}
    </label>
  );
}

export function DemoForm({ initialSample }: { initialSample: boolean }) {
  const [values, setValues] = useState<FormValues>(
    initialSample ? { ...MIDTOWN_SCENARIO } : EMPTY,
  );
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  function set(key: keyof FieldReport, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function loadSample() {
    setValues({ ...MIDTOWN_SCENARIO });
    setErrors({});
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = fieldReportSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<FormValues> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setLoading(true);
    setResult(null);
    setSubmitError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        // Surface the server's structured error when it sent one.
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `The server responded with status ${res.status}.`);
      }
      setResult((await res.json()) as GenerateResponse);
    } catch (err) {
      console.error("demo: generate request failed:", err);
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong reaching the server. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={submit} noValidate className="print-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-white">Field Report</h2>
          <button
            type="button"
            onClick={loadSample}
            className={`${buttonGhost} px-3 py-1.5 text-sm`}
          >
            <ClipboardList className="size-4" aria-hidden />
            Load sample scenario
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Company Name" error={errors.companyName}>
            <input
              className={inputClass}
              value={values.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="Meridian Electric Co."
            />
          </Field>
          <Field label="Project Name" error={errors.projectName}>
            <input
              className={inputClass}
              value={values.projectName}
              onChange={(e) => set("projectName", e.target.value)}
              placeholder="Midtown Office Renovation"
            />
          </Field>
          <Field label="Submitted By" error={errors.submittedBy}>
            <input
              className={inputClass}
              value={values.submittedBy}
              onChange={(e) => set("submittedBy", e.target.value)}
              placeholder="Name, role"
            />
          </Field>
          <Field label="Project Manager Email" error={errors.pmEmail}>
            <input
              type="email"
              className={inputClass}
              value={values.pmEmail}
              onChange={(e) => set("pmEmail", e.target.value)}
              placeholder="pm@yourcompany.com"
            />
          </Field>
          <Field label="Trade" error={errors.trade}>
            <select
              className={inputClass}
              value={values.trade}
              onChange={(e) => set("trade", e.target.value)}
            >
              {TRADES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Change Type" error={errors.changeType}>
            <select
              className={inputClass}
              value={values.changeType}
              onChange={(e) => set("changeType", e.target.value)}
            >
              {CHANGE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-5 space-y-5">
          <Field label="Description of Changed Condition" error={errors.description}>
            <textarea
              className={`${inputClass} min-h-24`}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What changed, who directed it, and which drawings it affects."
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Labor Impact" error={errors.laborImpact}>
              <textarea
                className={`${inputClass} min-h-20`}
                value={values.laborImpact}
                onChange={(e) => set("laborImpact", e.target.value)}
                placeholder="Crew size and hours."
              />
            </Field>
            <Field label="Material Impact" error={errors.materialImpact}>
              <textarea
                className={`${inputClass} min-h-20`}
                value={values.materialImpact}
                onChange={(e) => set("materialImpact", e.target.value)}
                placeholder="Material, equipment, rentals."
              />
            </Field>
            <Field label="Schedule Impact" error={errors.scheduleImpact}>
              <textarea
                className={`${inputClass} min-h-20`}
                value={values.scheduleImpact}
                onChange={(e) => set("scheduleImpact", e.target.value)}
                placeholder="Days added, sequencing holds."
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Urgency" error={errors.urgency}>
              <select
                className={inputClass}
                value={values.urgency}
                onChange={(e) => set("urgency", e.target.value)}
              >
                {URGENCIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </Field>
            <Field label="Requested Next Step" error={errors.requestedNextStep}>
              <input
                className={inputClass}
                value={values.requestedNextStep}
                onChange={(e) => set("requestedNextStep", e.target.value)}
                placeholder="Issue change order before close-in."
              />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${buttonPrimary} mt-8 px-6 py-3 text-sm font-semibold disabled:opacity-60`}
        >
          {loading ? "Drafting your change request…" : "Generate Change Request"}
        </button>
        {submitError ? (
          <p role="alert" className="mt-3 text-sm text-amber">
            {submitError}
          </p>
        ) : null}
      </form>

      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="print-hidden animate-pulse rounded-lg border border-line bg-surface p-6"
        >
          <p className="font-utility text-xs uppercase tracking-[0.2em] text-amber">
            Drafting your change request…
          </p>
          <div className="mt-4 space-y-3">
            <div className="h-3 w-3/4 rounded bg-line" />
            <div className="h-3 w-full rounded bg-line" />
            <div className="h-3 w-5/6 rounded bg-line" />
          </div>
        </div>
      ) : null}

      {result ? (
        <div ref={resultRef} className="scroll-mt-24">
          <div className="print-hidden mb-4 flex justify-end">
            <PrintButton />
          </div>
          <SampleOutput pkg={result.pkg} source={result.source} />
        </div>
      ) : null}
    </div>
  );
}
