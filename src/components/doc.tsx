import type { ReactNode } from "react";
import { Container } from "@/components/ui";
import { PrintButton } from "@/components/print-button";

/**
 * Paper-white document shell on the dark site chrome. On print, the chrome
 * disappears (print-hidden + globals.css) and the document owns the page.
 */
export function DocShell({
  docType,
  title,
  subtitle,
  note,
  children,
}: {
  docType: string;
  title: string;
  subtitle?: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-12 lg:py-16 print:max-w-none print:p-0">
      <div className="print-hidden mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-fog">{docType}</p>
        <PrintButton />
      </div>
      <article className="doc-paper mx-auto max-w-3xl rounded-lg bg-paper px-8 py-12 text-[#1a1d23] shadow-2xl sm:px-12 sm:py-16 print:max-w-none print:rounded-none print:px-0 print:py-0 print:shadow-none">
        <header className="border-b-2 border-[#1a1d23] pb-8">
          <p className="font-utility text-xs uppercase tracking-[0.25em] text-[#8a8378]">
            That&apos;s Extra<span className="text-amber-deep">.</span> — {docType}
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-base leading-relaxed text-[#5c574e]">{subtitle}</p>
          ) : null}
          {note ? (
            <p className="mt-4 rounded border border-[#d8d2c6] bg-[#efece4] px-3 py-2 text-xs leading-relaxed text-[#5c574e]">
              {note}
            </p>
          ) : null}
        </header>
        <div className="space-y-10 pt-10">{children}</div>
      </article>
    </Container>
  );
}

export function DocSection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="break-inside-avoid">
      <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold tracking-tight">
        {number ? (
          <span className="font-utility text-sm font-normal text-[#8a8378]">{number}</span>
        ) : null}
        {title}
      </h2>
      <div className="doc-body mt-4 space-y-4 text-[15px] leading-relaxed text-[#33373e]">
        {children}
      </div>
    </section>
  );
}

/** Signature block used by both the proposal and the contract. */
export function SignatureBlock({ parties }: { parties: { role: string; org: string }[] }) {
  return (
    <div className="grid gap-10 pt-4 sm:grid-cols-2">
      {parties.map((party) => (
        <div key={party.role}>
          <p className="font-utility text-xs uppercase tracking-wider text-[#8a8378]">
            {party.role}
          </p>
          <p className="mt-1 text-sm font-semibold">{party.org}</p>
          <dl className="mt-6 space-y-6 text-sm">
            {["Name", "Title", "Signature", "Date"].map((field) => (
              <div key={field} className="flex items-end gap-3">
                <dt className="w-20 shrink-0 text-[#5c574e]">{field}</dt>
                <dd className="flex-1 border-b border-[#8a8378]">&nbsp;</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
