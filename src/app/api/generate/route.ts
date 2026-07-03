import { handleGenerate } from "@/lib/generate-handler";

// Headroom for one 15s OpenAI attempt plus the fallback path.
export const maxDuration = 30;

export async function POST(req: Request) {
  const r = await handleGenerate(await req.json().catch(() => null));
  return Response.json(r.json, { status: r.status });
}
