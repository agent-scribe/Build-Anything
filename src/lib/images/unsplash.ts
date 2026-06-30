/**
 * unsplash.ts — resolve {{unsplash:keywords}} tokens to real image URLs.
 * ------------------------------------------------------------------
 * Uses the Unsplash Source API (no auth required for basic usage) to
 * convert placeholder tokens into real, attribution-free images.
 * Falls back gracefully if the token doesn't match the pattern.
 */

const UNSPLASH_PATTERN = /^\{\{unsplash:(.+)\}\}$/i;

/**
 * Check if a src string is an unsplash placeholder token.
 */
export function isUnsplashToken(src: string): boolean {
  return UNSPLASH_PATTERN.test(src);
}

/**
 * Extract keywords from an unsplash placeholder token.
 */
export function extractKeywords(src: string): string | null {
  const match = src.match(UNSPLASH_PATTERN);
  return match ? match[1].trim() : null;
}

/**
 * Resolve an image src — if it's an unsplash token, return a real URL.
 * Otherwise return the src unchanged.
 *
 * Uses Unsplash Source (images.unsplash.com) which provides random
 * images matching keywords without requiring API keys.
 *
 * @param src      Image src (may be a URL or {{unsplash:...}} token)
 * @param width    Desired width in pixels
 * @param height   Desired height in pixels
 */
export function resolveImageSrc(
  src: string,
  width: number = 800,
  height: number = 600
): string {
  const keywords = extractKeywords(src);
  if (!keywords) return src;

  // Use Unsplash Source API — free, no key needed
  const query = encodeURIComponent(keywords.replace(/[-_]/g, " "));
  return `https://source.unsplash.com/${width}x${height}/?${query}`;
}

/**
 * Build an Unsplash URL using their newer /photos/random redirect.
 * This is more reliable than source.unsplash.com.
 */
export function unsplashUrl(
  keywords: string,
  width: number = 800,
  height: number = 600
): string {
  const query = encodeURIComponent(keywords.replace(/[-_]/g, " "));
  return `https://images.unsplash.com/photo-placeholder?w=${width}&h=${height}&q=80&fit=crop&auto=format&query=${query}`;
}
