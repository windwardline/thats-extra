"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

type Choice = "light" | "dark" | "system";
const KEY = "te-theme";

const OPTIONS: Array<{ choice: Choice; label: string }> = [
  { choice: "light", label: "Day rate" },
  { choice: "dark", label: "Night rate" },
  { choice: "system", label: "Prevailing" },
];

function read(): Choice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

/** Day rate / night rate / prevailing — the prevailing rate is whatever
 *  the visitor's system charges. */
export function ThemeLamp() {
  const listeners = useRef(new Set<() => void>());
  const subscribe = useCallback((cb: () => void) => {
    listeners.current.add(cb);
    return () => listeners.current.delete(cb);
  }, []);
  const choice = useSyncExternalStore<Choice>(subscribe, read, () => "system");

  function pick(next: Choice) {
    try {
      if (next === "system") window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, next);
    } catch {
      /* private mode: applies for this page view only */
    }
    if (next === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", next);
    listeners.current.forEach((cb) => cb());
  }

  return (
    <div className="lamp print-hidden" role="group" aria-label="Theme">
      {OPTIONS.map(({ choice: value, label }) => (
        <button
          key={value}
          type="button"
          className="lamp-opt"
          aria-pressed={choice === value}
          onClick={() => pick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
