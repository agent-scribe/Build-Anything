/**
 * POST /api/export
 * ------------------------------------------------------------------
 * Body: { document: SiteDocument, format: "html" | "react" }
 *   - "html"  → returns a single standalone .html document (text/html)
 *   - "react" → returns a JSON map of files for a React/Next.js bundle
 *
 * The document is re-validated server-side; export never trusts the client.
 */
import { SiteDocumentSchema } from "@/lib/schema/page-schema";
import { renderSiteToHtml } from "@/lib/export/html";
import { exportReactBundle } from "@/lib/export/react";

export const runtime = "nodejs";

interface ExportBody {
  document?: unknown;
  format?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  let body: ExportBody;
  try {
    body = (await req.json()) as ExportBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SiteDocumentSchema.safeParse(body.document);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid document", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
      { status: 422 }
    );
  }

  const format = body.format === "react" ? "react" : "html";
  const slug = parsed.data.meta.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "site";

  if (format === "html") {
    const html = renderSiteToHtml(parsed.data);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.html"`,
      },
    });
  }

  const files = exportReactBundle(parsed.data);
  return Response.json({ format: "react", files });
}
