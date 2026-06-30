/**
 * POST /api/generate
 * ------------------------------------------------------------------
 * Streams the generation pipeline to the browser as Server-Sent Events.
 * Each SSE `data:` line is one JSON-encoded GenerationEvent. The client
 * reads these to drive the status UI and, on the final `result` event,
 * loads the validated SiteDocument into the editor store.
 *
 * Phase 2: added rate-limiting (5 req/min per IP) and a 120 s timeout
 * so a hung Claude call can't hold a Vercel function open forever.
 */
import { runGenerationStream, type GenerationEvent } from "@/lib/ai/pipeline";
import type { GenerationBrief } from "@/lib/ai/generator-prompt";
import { checkRateLimit, clientIp } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Vercel: keep the function alive long enough for a full generation. */
export const maxDuration = 120;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const STREAM_TIMEOUT_MS = 120_000;

interface GenerateBody {
  prompt?: unknown;
  industry?: unknown;
  mode?: unknown;
  ecommerce?: unknown;
  styleHint?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  // --- Rate-limit ---
  const ip = clientIp(req);
  const rl = checkRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return Response.json(
      { error: "Rate limit exceeded. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetInMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // --- Parse body ---
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
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        send(controller, {
          type: "error",
          message: "Generation timed out. Please try again with a simpler prompt.",
        });
        controller.enqueue(encoder.encode("event: end\ndata: {}\n\n"));
        controller.close();
      }, STREAM_TIMEOUT_MS);

      try {
        for await (const event of runGenerationStream(brief)) {
          if (timedOut) break;
          send(controller, event);
        }
      } catch (err) {
        if (!timedOut) {
          send(controller, {
            type: "error",
            message: err instanceof Error ? err.message : "Stream failed",
          });
        }
      } finally {
        clearTimeout(timeout);
        if (!timedOut) {
          controller.enqueue(encoder.encode("event: end\ndata: {}\n\n"));
          controller.close();
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-RateLimit-Remaining": String(rl.remaining),
    },
  });
}
