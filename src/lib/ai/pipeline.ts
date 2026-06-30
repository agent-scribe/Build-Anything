/**
 * pipeline.ts — the generation engine orchestrator.
 * ------------------------------------------------------------------
 * Four stages: PLAN → GENERATE → VALIDATE → REPAIR (bounded). Emits a
 * typed event stream so the route can forward progress over SSE and the
 * UI can show real status. Falls back to a deterministic mock when no
 * ANTHROPIC_API_KEY is configured, so the product is fully demoable.
 */
import { SAMPLE_SITE } from "@/lib/schema/defaults";
import { validateSiteDocument, type SiteDocument } from "@/lib/schema/page-schema";
import {
  buildGeneratorUser,
  buildPlannerPrompt,
  buildRepairUser,
  GENERATOR_SYSTEM,
  type GenerationBrief,
} from "./generator-prompt";
import {
  completeText,
  extractJson,
  GENERATOR_MODEL,
  hasAnthropicKey,
  PLANNER_MODEL,
  streamText,
} from "./client";

export type GenStage = "planning" | "generating" | "validating" | "repairing" | "done";

export type GenerationEvent =
  | { type: "status"; stage: GenStage; message: string }
  | { type: "plan"; order: string[] }
  | { type: "delta"; text: string }
  | { type: "result"; document: SiteDocument; usedMock: boolean }
  | { type: "error"; message: string; issues?: string[] };

const MAX_REPAIRS = 2;
const DEFAULT_ORDER = ["navbar", "hero", "features", "testimonials", "cta", "footer"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Streaming generation. Consume with `for await (const e of runGenerationStream(brief))`. */
export async function* runGenerationStream(
  brief: GenerationBrief
): AsyncGenerator<GenerationEvent> {
  if (!hasAnthropicKey()) {
    yield* mockStream(brief);
    return;
  }

  try {
    // STAGE 1 — PLAN
    yield { type: "status", stage: "planning", message: "Planning page structure" };
    const order = await planOrder(brief);
    yield { type: "plan", order };

    // STAGE 2 — GENERATE (streamed)
    yield { type: "status", stage: "generating", message: "Designing your site" };
    let raw = "";
    for await (const delta of streamText({
      model: GENERATOR_MODEL,
      system: GENERATOR_SYSTEM,
      cacheSystem: true,
      user: buildGeneratorUser(brief, order),
      maxTokens: 8192,
      temperature: 0.7,
    })) {
      raw += delta;
      yield { type: "delta", text: delta };
    }

    // STAGE 3 — VALIDATE (+ STAGE 4 REPAIR loop)
    yield { type: "status", stage: "validating", message: "Validating layout" };
    const result = await validateWithRepair(raw);
    if (result.ok) {
      yield { type: "status", stage: "done", message: "Done" };
      yield { type: "result", document: result.data, usedMock: false };
    } else {
      yield { type: "error", message: "Could not produce a valid layout.", issues: result.issues };
    }
  } catch (err) {
    yield {
      type: "error",
      message: err instanceof Error ? err.message : "Generation failed unexpectedly.",
    };
  }
}

/** Non-streaming convenience for server actions / jobs. */
export async function runGeneration(
  brief: GenerationBrief
): Promise<{ ok: true; document: SiteDocument } | { ok: false; issues: string[] }> {
  let document: SiteDocument | null = null;
  let issues: string[] = ["No output produced"];
  for await (const event of runGenerationStream(brief)) {
    if (event.type === "result") document = event.document;
    if (event.type === "error") issues = event.issues ?? [event.message];
  }
  return document ? { ok: true, document } : { ok: false, issues };
}

/* ------------------------------------------------------------------ */
/* Stage helpers                                                       */
/* ------------------------------------------------------------------ */

async function planOrder(brief: GenerationBrief): Promise<string[]> {
  try {
    const raw = await completeText({
      model: PLANNER_MODEL,
      user: buildPlannerPrompt(brief),
      maxTokens: 256,
      temperature: 0.3,
    });
    const order = parseStringArray(raw);
    if (order && order.length >= 3) {
      const withBookends = ensureBookends(order);
      return withBookends;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_ORDER;
}

/** Validate raw model output, repairing up to MAX_REPAIRS times by feeding issues back. */
async function validateWithRepair(
  initialRaw: string
): Promise<{ ok: true; data: SiteDocument } | { ok: false; issues: string[] }> {
  let raw = initialRaw;
  let lastIssues: string[] = [];

  for (let attempt = 0; attempt <= MAX_REPAIRS; attempt++) {
    const parsed = extractJson(raw);
    if (parsed !== null) {
      const validation = validateSiteDocument(parsed);
      if (validation.ok) return { ok: true, data: validation.data };
      lastIssues = validation.issues;
    } else {
      lastIssues = ["Response did not contain a parseable JSON object."];
    }

    if (attempt === MAX_REPAIRS) break;

    // REPAIR — hand the model its exact errors and previous output.
    raw = await completeText({
      system: GENERATOR_SYSTEM,
      cacheSystem: true,
      user: buildRepairUser(raw, lastIssues),
      maxTokens: 8192,
      temperature: 0.2,
    });
  }

  return { ok: false, issues: lastIssues };
}

/* ------------------------------------------------------------------ */
/* Mock path — deterministic, no API key required                      */
/* ------------------------------------------------------------------ */

async function* mockStream(brief: GenerationBrief): AsyncGenerator<GenerationEvent> {
  yield { type: "status", stage: "planning", message: "Planning page structure (demo)" };
  await sleep(450);
  const order = SAMPLE_SITE.pages[0].sections.map((s) => s.type);
  yield { type: "plan", order };

  yield { type: "status", stage: "generating", message: "Designing your site (demo)" };
  await sleep(700);

  // Tailor the sample's metadata to the brief so the demo feels responsive.
  const document: SiteDocument = {
    ...SAMPLE_SITE,
    meta: {
      ...SAMPLE_SITE.meta,
      description: brief.prompt.slice(0, 180) || SAMPLE_SITE.meta.description,
    },
  };

  yield { type: "status", stage: "validating", message: "Validating layout (demo)" };
  await sleep(300);
  const validation = validateSiteDocument(document);
  if (!validation.ok) {
    yield { type: "error", message: "Mock document failed validation.", issues: validation.issues };
    return;
  }
  yield { type: "status", stage: "done", message: "Done (demo)" };
  yield { type: "result", document: validation.data, usedMock: true };
}

/* ------------------------------------------------------------------ */
/* Parsing utilities                                                   */
/* ------------------------------------------------------------------ */

function parseStringArray(raw: string): string[] | null {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const value = JSON.parse(match[0]);
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  } catch {
    /* ignore */
  }
  return null;
}

function ensureBookends(order: string[]): string[] {
  const body = order.filter((s) => s !== "navbar" && s !== "footer");
  return ["navbar", ...body, "footer"];
}
