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
    expect(JSON.parse(init.body)).toEqual({
      ...MIDTOWN_SCENARIO,
      reportJson: JSON.stringify(JSON.stringify(MIDTOWN_SCENARIO)).slice(1, -1),
    });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("escapes quotes and newlines in reportJson so it embeds inside a JSON string", async () => {
    vi.stubEnv("ZAPIER_WEBHOOK_URL", HOOK);
    const fetchFn = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    const tricky = { ...MIDTOWN_SCENARIO, description: 'GC said "move it"\nby Friday.' };
    await forwardToZapier(tricky, { fetchFn });
    const { reportJson } = JSON.parse(fetchFn.mock.calls[0][1].body);
    // Embedding the value verbatim between quotes must yield valid JSON.
    expect(JSON.parse(JSON.parse(`"${reportJson}"`))).toEqual(tricky);
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
