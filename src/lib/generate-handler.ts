import { fieldReportSchema, type GenerateResponse } from "@/lib/schema";
import { generateSamplePackage } from "@/lib/generator";
import { generateWithGroq } from "@/lib/groq";
import { forwardToZapier } from "@/lib/zapier";

export type GenerateResult = {
  status: number;
  json: GenerateResponse | { error: string };
};

/**
 * Framework-free request handler for /api/generate. Validates the body,
 * tries Groq when a key is configured, and falls back to the
 * deterministic sample generator on any failure — the demo never 500s.
 * Successful generations are also forwarded to the live Zapier automation
 * (a no-op unless ZAPIER_WEBHOOK_URL is configured).
 */
export async function handleGenerate(
  body: unknown,
  deps: { generate?: typeof generateWithGroq; forward?: typeof forwardToZapier } = {},
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
  const generate = deps.generate ?? generateWithGroq;
  const forward = deps.forward ?? forwardToZapier;

  if (process.env.GROQ_API_KEY) {
    try {
      const pkg = await generate(report);
      return { status: 200, json: { source: "groq", pkg, zapier: await forward(report) } };
    } catch (err) {
      console.warn("generate: falling back to sample:", err);
    }
  }

  return {
    status: 200,
    json: { source: "sample", pkg: generateSamplePackage(report), zapier: await forward(report) },
  };
}
