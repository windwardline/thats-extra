import { fieldReportSchema, type GenerateResponse } from "@/lib/schema";
import { generateSamplePackage } from "@/lib/generator";
import { generateWithOpenAI } from "@/lib/openai";

export type GenerateResult = {
  status: number;
  json: GenerateResponse | { error: string };
};

/**
 * Framework-free request handler for /api/generate. Validates the body,
 * tries OpenAI when a key is configured, and falls back to the
 * deterministic sample generator on any failure — the demo never 500s.
 */
export async function handleGenerate(
  body: unknown,
  deps: { generate?: typeof generateWithOpenAI } = {},
): Promise<GenerateResult> {
  const parsed = fieldReportSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const field = first.path.join(".") || "request body";
    return {
      status: 400,
      json: { error: `Invalid field report: ${field} — ${first.message}` },
    };
  }

  const report = parsed.data;
  const generate = deps.generate ?? generateWithOpenAI;

  if (process.env.OPENAI_API_KEY) {
    try {
      const pkg = await generate(report);
      return { status: 200, json: { source: "openai", pkg } };
    } catch (err) {
      console.warn("generate: falling back to sample:", err);
    }
  }

  return { status: 200, json: { source: "sample", pkg: generateSamplePackage(report) } };
}
