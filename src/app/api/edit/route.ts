/**
 * POST /api/edit
 * ------------------------------------------------------------------
 * AI-assisted targeted edit. Takes a section's current props + an
 * instruction and returns patched props — no full regeneration needed.
 */
import { completeText, extractJson, hasAnthropicKey } from "@/lib/ai/client";
import { checkRateLimit, clientIp } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface EditBody {
  instruction?: unknown;
  sectionType?: unknown;
  currentProps?: unknown;
  theme?: unknown;
}

const SYSTEM = `You are WeBuild's AI editor. You receive a section's current JSON props, its type, and a user instruction.
Return ONLY the patched props JSON — same shape, same keys, just with the requested changes applied.
Rules:
- Return raw JSON only. No markdown fences, no commentary.
- Preserve all keys that the user didn't ask to change.
- Keep the same types (strings stay strings, arrays stay arrays).
- For copy changes: match the existing tone and length unless told otherwise.
- For style changes: only change values that map to the request.
- Never add or remove required keys.`;

export async function POST(req: Request): Promise<Response> {
  if (!hasAnthropicKey()) {
    return Response.json({ error: "AI editing requires an API key." }, { status: 503 });
  }

  const ip = clientIp(req);
  const rl = checkRateLimit(ip, 10, 60_000);
  if (!rl.allowed) {
    return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body: EditBody;
  try {
    body = (await req.json()) as EditBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.instruction !== "string" || !body.instruction.trim()) {
    return Response.json({ error: "instruction is required" }, { status: 400 });
  }
  if (!body.currentProps || typeof body.currentProps !== "object") {
    return Response.json({ error: "currentProps is required" }, { status: 400 });
  }

  const user = `Section type: ${body.sectionType ?? "unknown"}

Current props:
${JSON.stringify(body.currentProps, null, 2)}

${body.theme ? `Current theme context:\n${JSON.stringify(body.theme, null, 2)}\n` : ""}
Instruction: ${body.instruction}

Return the FULL patched props JSON:`;

  try {
    const raw = await completeText({
      system: SYSTEM,
      user,
      maxTokens: 4096,
      temperature: 0.4,
    });

    const parsed = extractJson(raw);
    if (!parsed || typeof parsed !== "object") {
      return Response.json({ error: "AI returned invalid JSON" }, { status: 502 });
    }

    return Response.json({ props: parsed });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Edit failed" },
      { status: 500 }
    );
  }
}
