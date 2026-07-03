export type WorkflowStep = {
  label: string;
  detail?: string;
  /** Marks the payoff node — rendered in amber. */
  accent?: boolean;
};

/**
 * Schematic-style workflow diagram — thin connector lines, square node
 * markers, mono labels, like a single-line diagram on a drawing set.
 */
export function WorkflowDiagram({
  steps,
  orientation = "vertical",
}: {
  steps: WorkflowStep[];
  orientation?: "vertical" | "horizontal";
}) {
  if (orientation === "horizontal") {
    return (
      <ol className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((step, i) => (
          <li key={step.label} className="flex flex-1 flex-row items-stretch lg:flex-col">
            <div className="flex flex-col items-center lg:flex-row">
              <span
                aria-hidden
                className={`mt-1 size-2.5 shrink-0 rotate-45 lg:mt-0 ${
                  step.accent ? "bg-amber" : "border border-fog bg-surface"
                }`}
              />
              {i < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="w-px flex-1 bg-line lg:h-px lg:w-auto lg:flex-1"
                />
              ) : null}
            </div>
            <div className="-mt-1.5 mb-6 ml-4 lg:mb-0 lg:ml-0 lg:mt-3 lg:pr-6">
              <p
                className={`font-utility text-xs uppercase tracking-wider ${
                  step.accent ? "text-amber" : "text-bright"
                }`}
              >
                {step.label}
              </p>
              {step.detail ? (
                <p className="mt-1 text-sm leading-relaxed text-fog">{step.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol>
      {steps.map((step, i) => (
        <li key={step.label} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              aria-hidden
              className={`mt-1 size-2.5 shrink-0 rotate-45 ${
                step.accent ? "bg-amber" : "border border-fog bg-surface"
              }`}
            />
            {i < steps.length - 1 ? (
              <span aria-hidden className="w-px flex-1 bg-line" />
            ) : null}
          </div>
          <div className={i < steps.length - 1 ? "pb-6" : ""}>
            <p
              className={`font-utility text-xs uppercase tracking-wider ${
                step.accent ? "text-amber" : "text-bright"
              }`}
            >
              {step.label}
            </p>
            {step.detail ? (
              <p className="mt-1 text-sm leading-relaxed text-fog">{step.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
