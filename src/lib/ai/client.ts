/**
 * client.ts — thin, typed wrapper over the Anthropic SDK.
 * ------------------------------------------------------------------
 * Centralizes model selection, prompt caching, streaming, and the
 * JSON-extraction step. The pipeline never imports the SDK directly.
 */
import Anthropic from "@anthropic-ai/sdk";

/** Quality model for full generation. Override with WEBUILD_GENERATOR_MODEL. */
export const GENERATOR_MODEL = process.env.WEBUILD_GENERATOR_MODEL ?? "claude-sonnet-4-6";
/** Fast/cheap model for the planning stage. Override with WEBUILD_PLANNER_MODEL. */
export const PLANNER_MODEL = process.env.WEBUILD_PLANNER_MODEL ?? "claude-haiku-4-5-20251001";

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new MissingKeyError();
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export class MissingKeyError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY is not set");
    this.name = "MissingKeyError";
  }
}

interface CompleteOptions {
  model?: string;
  system?: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
  /** Cache the system block across calls (big, stable prompts). */
  cacheSystem?: boolean;
}

/** Non-streaming completion → concatenated text. */
export async function completeText(opts: CompleteOptions): Promise<string> {
  const message = await client().messages.create({
    model: opts.model ?? GENERATOR_MODEL,
    max_tokens: opts.maxTokens ?? 8192,
    temperature: opts.temperature ?? 0.7,
    system: buildSystem(opts.system, opts.cacheSystem),
    messages: [{ role: "user", content: opts.user }],
  });
  return textFrom(message);
}

/**
 * Streaming completion. Yields text deltas as they arrive and returns the
 * full concatenated text when the stream closes.
 */
export async function* streamText(
  opts: CompleteOptions
): AsyncGenerator<string, string, void> {
  const stream = client().messages.stream({
    model: opts.model ?? GENERATOR_MODEL,
    max_tokens: opts.maxTokens ?? 8192,
    temperature: opts.temperature ?? 0.7,
    system: buildSystem(opts.system, opts.cacheSystem),
    messages: [{ role: "user", content: opts.user }],
  });

  let full = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      full += event.delta.text;
      yield event.delta.text;
    }
  }
  await stream.done();
  return full;
}

function buildSystem(
  system: string | undefined,
  cache: boolean | undefined
): Anthropic.MessageCreateParams["system"] {
  if (!system) return undefined;
  if (!cache) return system;
  return [{ type: "text", text: system, cache_control: { type: "ephemeral" } }];
}

function textFrom(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

/* ------------------------------------------------------------------ */
/* JSON extraction — tolerate fences/prose despite our instructions    */
/* ------------------------------------------------------------------ */

/**
 * Pull the first balanced JSON object out of a model response. Handles
 * ```json fences, leading prose, and trailing text. Returns null if no
 * parseable object is found.
 */
export function extractJson(raw: string): unknown | null {
  if (!raw) return null;

  // Strip code fences if present.
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;

  const start = candidate.indexOf("{");
  if (start === -1) return null;

  // Walk the string tracking brace depth, respecting strings/escapes.
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const slice = candidate.slice(start, i + 1);
        try {
          return JSON.parse(slice);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
