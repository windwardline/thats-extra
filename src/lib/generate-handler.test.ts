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
    vi.stubEnv("GROQ_API_KEY", "");
    const r = await handleGenerate(MIDTOWN_SCENARIO);
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ source: "sample" });
  });

  it("uses groq source when key is set and the call succeeds", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk-test");
    const fake = generateSamplePackage(MIDTOWN_SCENARIO);
    const r = await handleGenerate(MIDTOWN_SCENARIO, { generate: vi.fn().mockResolvedValue(fake) });
    expect(r.json).toMatchObject({ source: "groq" });
  });

  it("falls back to sample when the OpenAI call fails", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk-test");
    const r = await handleGenerate(MIDTOWN_SCENARIO, { generate: vi.fn().mockRejectedValue(new Error("boom")) });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ source: "sample" });
  });

  it("reports the zapier dispatch status on success responses", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    const forward = vi.fn().mockResolvedValue("sent");
    const r = await handleGenerate(MIDTOWN_SCENARIO, { forward });
    expect(r.json).toMatchObject({ source: "sample", zapier: "sent" });
    expect(forward).toHaveBeenCalledWith(
      expect.objectContaining({ projectName: MIDTOWN_SCENARIO.projectName }),
    );
  });

  it("forwards to zapier on the groq path too", async () => {
    vi.stubEnv("GROQ_API_KEY", "gsk-test");
    const fake = generateSamplePackage(MIDTOWN_SCENARIO);
    const forward = vi.fn().mockResolvedValue("skipped");
    const r = await handleGenerate(MIDTOWN_SCENARIO, {
      generate: vi.fn().mockResolvedValue(fake),
      forward,
    });
    expect(r.json).toMatchObject({ source: "groq", zapier: "skipped" });
  });

  it("does not forward to zapier on validation failure", async () => {
    const forward = vi.fn();
    await handleGenerate({ nope: true }, { forward });
    expect(forward).not.toHaveBeenCalled();
  });
});
