"use client";

import { Printer } from "lucide-react";
import { buttonGhost } from "@/components/ui";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`print-hidden ${buttonGhost} px-3 py-1.5 text-sm`}
    >
      <Printer className="size-4" aria-hidden />
      Print / Save PDF
    </button>
  );
}
