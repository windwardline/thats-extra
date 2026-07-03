"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";

function legacyCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    ta.remove();
  }
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    // Clipboard API is unavailable on insecure origins; fall back to the
    // legacy path and surface failure rather than silently doing nothing.
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = legacyCopy(text);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="print-hidden inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-utility text-[11px] text-fog transition-colors hover:border-fog hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
    >
      {state === "copied" ? (
        <Check className="size-3 text-amber" />
      ) : state === "failed" ? (
        <X className="size-3 text-amber" />
      ) : (
        <Copy className="size-3" />
      )}
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
    </button>
  );
}
