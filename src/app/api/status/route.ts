/**
 * GET /api/status
 * ------------------------------------------------------------------
 * Server capability probe. The client calls this on mount to decide
 * whether to use real Claude generation or the built-in demo fallback.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
    version: "2.0",
  });
}
