import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
}

/**
 * Single source of truth for button treatments — consumed by the Link-based
 * Button below and by real <button> elements (form submit, print, etc.).
 */
export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
export const buttonPrimary = `${buttonBase} bg-amber text-ink hover:bg-amber-deep shadow-[0_0_24px_rgba(245,165,36,0.25)]`;
export const buttonGhost = `${buttonBase} border border-line text-fog hover:border-fog hover:text-white`;

export function Button({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  const styles = variant === "primary" ? buttonPrimary : `${buttonGhost} text-bright`;
  return (
    <Link href={href} className={`${styles} px-5 py-3 text-sm font-semibold`}>
      {children}
    </Link>
  );
}

export function Badge({
  tone = "neutral",
  children,
  title,
}: {
  tone?: "amber" | "neutral";
  children: ReactNode;
  title?: string;
}) {
  const styles =
    tone === "amber"
      ? "border-amber/50 bg-amber/10 text-amber"
      : "border-line bg-surface text-fog";
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-utility text-xs tracking-wide ${styles}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-line bg-surface p-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-amber">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-lg leading-relaxed text-fog">{lede}</p> : null}
    </div>
  );
}
