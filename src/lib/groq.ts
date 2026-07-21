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

// Groq is the provider. It speaks the OpenAI wire protocol, so the official
// `openai` SDK is still the right client — only the base URL changes.
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Drafts the change request package via Groq's OpenAI-compatible API.
 *
 * Throws when no GROQ_API_KEY is configured or on any API/validation
 * failure — the caller (generate-handler) owns the fallback decision and
 * drops to the deterministic generator.
 */
export async function generateWithGroq(report: FieldReport): Promise<ChangeRequestPackage> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  // maxRetries: 0 — the caller falls back to the deterministic generator on
  // failure; SDK retries would stack 15s timeouts and can outlive a
  // serverless function's duration limit before the fallback ever runs.
  const client = new OpenAI({
    apiKey,
    baseURL: process.env.GROQ_BASE_URL || GROQ_BASE_URL,
    timeout: 15_000,
    maxRetries: 0,
  });
  const completion = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(report) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty completion");

  return changeRequestPackageSchema.parse(JSON.parse(content));
}
