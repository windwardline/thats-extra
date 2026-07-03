import OpenAI from "openai";
import {
  changeRequestPackageSchema,
  type ChangeRequestPackage,
  type FieldReport,
} from "@/lib/schema";

// Derived from the schema so the prompt can never drift out of sync with
// the validator (a stale key list would silently force every live request
// into the sample fallback).
const PACKAGE_KEYS = Object.keys(changeRequestPackageSchema.shape).join(", ");

const SYSTEM_PROMPT = `You are a professional construction change-request writer working on behalf of a specialty-trade subcontractor. Given a field report, draft a complete, professional change request package a real subcontractor would send to a general contractor.

Return a JSON object with exactly these string keys: ${PACKAGE_KEYS}.

Rules:
- Formal, confident, factual tone. No hedging, no apologies.
- Weave the report's actual company, project, impacts, urgency, and requested next step into every relevant section.
- customerFacingRequest is a formal multi-paragraph change request suitable to forward to the GC.
- emailDraft is a ready-to-send email to the project manager, signed by the submitter.
- Do not invent dollar amounts unless they appear in the report.`;

/**
 * Calls an OpenAI-compatible API to draft the change request package.
 * Defaults to OpenAI itself; set OPENAI_BASE_URL + OPENAI_MODEL to use a
 * compatible provider (e.g. Groq: https://api.groq.com/openai/v1 with
 * model openai/gpt-oss-120b). Throws when no OPENAI_API_KEY is configured
 * or on any API/validation failure — the caller (generate-handler) owns
 * the fallback decision.
 */
export async function generateWithOpenAI(report: FieldReport): Promise<ChangeRequestPackage> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  // maxRetries: 0 — the caller falls back to the deterministic generator on
  // failure; SDK retries would stack 15s timeouts and can outlive a
  // serverless function's duration limit before the fallback ever runs.
  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
    timeout: 15_000,
    maxRetries: 0,
  });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(report) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty completion");

  return changeRequestPackageSchema.parse(JSON.parse(content));
}
