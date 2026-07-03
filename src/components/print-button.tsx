"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hidden inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-fog transition-colors hover:border-fog hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
    >
      <Printer className="size-4" aria-hidden />
      Print / Save PDF
    </button>
  );
}
