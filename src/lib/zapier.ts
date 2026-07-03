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
  try {
    const res = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
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
