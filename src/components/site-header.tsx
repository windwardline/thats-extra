import Link from "next/link";
import { Container } from "@/components/ui";
import { NAV } from "@/lib/nav";

export function SiteHeader() {
  return (
    <header className="print-hidden sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-base font-bold tracking-tight text-white sm:text-lg"
        >
          THAT&apos;S EXTRA<span className="text-amber">.</span>
        </Link>
        <nav className="ml-4 flex items-center gap-0.5 overflow-x-auto sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] text-fog transition-colors hover:bg-surface hover:text-white sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
