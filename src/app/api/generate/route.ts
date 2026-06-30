/**
 * POST /api/generate
 * ------------------------------------------------------------------
 * Streams the generation pipeline to the browser as Server-Sent Events.
 * Each SSE `data:` line is one JSON-encoded GenerationEvent. The client
 * reads these to drive the status UI and, on the final `result` event,
 * loads the validated SiteDocument into the editor store.
 */
import { runGenerationStream, type GenerationEvent } from "@/lib/ai/pipeline";
import type { GenerationBrief } from "@/lib/ai/generator-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GenerateBody {
  prompt?: unknown;
  industry?: unknown;
  mode?: unknown;
  ecommerce?: unknown;
  styleHint?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  let body: GenerateBody;
  try {
    body = (await req.json()) as GenerateBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.prompt !== "string" || body.prompt.trim().length < 3) {
    return Response.json({ error: "`prompt` must be a non-empty string" }, { status: 400 });
  }

  const brief: GenerationBrief = {
    prompt: body.prompt.trim(),
    industry: typeof body.industry === "string" ? body.industry : undefined,
    mode: body.mode === "light" || body.mode === "dark" ? body.mode : undefined,
    ecommerce: body.ecommerce === true,
    styleHint: typeof body.styleHint === "string" ? body.styleHint : undefined,
  };

  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, event: GenerationEvent) =>
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runGenerationStream(brief)) {
          send(controller, event);
        }
      } catch (err) {
        send(controller, {
          type: "error",
          message: err instanceof Error ? err.message : "Stream failed",
        });
      } finally {
        controller.enqueue(encoder.encode("event: end\ndata: {}\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
