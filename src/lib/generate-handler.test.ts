import { afterEach, describe, expect, it, vi } from "vitest";
import { handleGenerate } from "@/lib/generate-handler";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";
import { generateSamplePackage } from "@/lib/generator";

afterEach(() => vi.unstubAllEnvs());

describe("handleGenerate", () => {
  it("400s on an invalid body", async () => {
    const r = await handleGenerate({ nope: true });
    expect(r.status).toBe(400);
  });

  it("uses sample source when no API key is set", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const r = await handleGenerate(MIDTOWN_SCENARIO);
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ source: "sample" });
  });

  it("uses openai source when key is set and the call succeeds", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const fake = generateSamplePackage(MIDTOWN_SCENARIO);
    const r = await handleGenerate(MIDTOWN_SCENARIO, { generate: vi.fn().mockResolvedValue(fake) });
    expect(r.json).toMatchObject({ source: "openai" });
  });

  it("falls back to sample when the OpenAI call fails", async () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const r = await handleGenerate(MIDTOWN_SCENARIO, { generate: vi.fn().mockRejectedValue(new Error("boom")) });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ source: "sample" });
  });
});
