import { afterEach, describe, expect, it, vi } from "vitest";
import { forwardToZapier } from "@/lib/zapier";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";

afterEach(() => vi.unstubAllEnvs());

const HOOK = "https://hooks.zapier.com/hooks/catch/123/abc/";

describe("forwardToZapier", () => {
  it("skips when ZAPIER_WEBHOOK_URL is not set", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", "");
    const fetchFn = vi.fn();
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("skipped");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("POSTs the report as JSON and reports sent on 200", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("sent");
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe(HOOK);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual(MIDTOWN_SCENARIO);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("reports failed on a non-2xx response", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockResolvedValue(new Response("nope", { status: 500 }));
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("failed");
  });

  it("reports failed when fetch rejects (network error / timeout)", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockRejectedValue(new Error("timeout"));
    expect(await forwardToZapier(MIDTOWN_SCENARIO, { fetchFn })).toBe("failed");
  });
});
