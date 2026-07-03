import type { FieldReport, ZapierStatus } from "@/lib/schema";

/**
 * Forwards a validated field report to the Zapier catch-hook that runs the
 * live six-step automation (see docs/zapier/zap-setup.md). Never throws:
 * the demo's on-screen result must render whether or not the automation
 * fires, so failures are logged and reported as a status instead.
 */
export async function forwardToZapier(
  report: FieldReport,
  deps: { fetchFn?: typeof fetch } = {},
): Promise<ZapierStatus> {
  const url = process.env.ZAPIER_WEBHOOK_URL;
  if (!url) return "skipped";

  const fetchFn = deps.fetchFn ?? fetch;
  // reportJson is the serialized report, escaped so the Zap's Custom
  // Request step can embed it verbatim inside a JSON string literal —
  // Zapier inserts mapped fields without escaping, so quotes/newlines in
  // raw fields would otherwise corrupt the Groq request body.
  const payload = {
    ...report,
    reportJson: JSON.stringify(JSON.stringify(report)).slice(1, -1),
  };
  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`zapier: webhook responded ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("zapier: webhook dispatch failed:", err);
    return "failed";
  }
}
