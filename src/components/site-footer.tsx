import Link from "next/link";
import { Container } from "@/components/ui";
import { NAV } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="print-hidden border-t border-line bg-surface">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-bold text-white">
            THAT&apos;S EXTRA<span className="text-amber">.</span>
          </p>
          <p className="mt-1 text-sm text-fog">
            Every &ldquo;Can You Just...&rdquo; Has a Price.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-fog transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="font-utility text-xs text-fog">
          Built for the trades. © 2026 That&apos;s Extra.
        </p>
      </Container>
    </footer>
  );
}
