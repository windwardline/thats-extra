import { handleGenerate } from "@/lib/generate-handler";

export async function POST(req: Request) {
  const r = await handleGenerate(await req.json().catch(() => null));
  return Response.json(r.json, { status: r.status });
}
