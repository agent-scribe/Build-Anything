/**
 * rate-limit.ts — simple in-memory sliding-window rate limiter.
 * ------------------------------------------------------------------
 * No Redis dependency — suitable for single-instance serverless.
 * Each Vercel function instance has its own map, so this is a
 * best-effort limit, not a globally coordinated one. Good enough
 * to prevent accidental key burn.
 */

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

/** Evict entries older than the window to prevent unbounded memory growth. */
function evictStale(windowMs: number) {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

// Sweep every 60 s
let sweepTimer: ReturnType<typeof setInterval> | null = null;
function ensureSweep(windowMs: number) {
  if (sweepTimer) return;
  sweepTimer = setInterval(() => evictStale(windowMs), 60_000);
  // Don't hold the process open
  if (typeof sweepTimer === "object" && "unref" in sweepTimer) sweepTimer.unref();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * Check and consume one request from the budget for `key`.
 * @param key     Identifier (IP, user-id, etc.)
 * @param limit   Max requests per window
 * @param windowMs  Window duration in ms
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): RateLimitResult {
  ensureSweep(windowMs);
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetInMs: oldest + windowMs - now,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    resetInMs: windowMs,
  };
}

/** Extract a reasonable client identifier from a request. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
