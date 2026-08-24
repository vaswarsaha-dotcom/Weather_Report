/**
 * Minimal fixed-window rate limiter.
 *
 * This in-memory implementation is fine for a single Node process (local
 * dev, or a single long-running server) but resets on cold start and does
 * not share state across serverless instances. For production on Vercel,
 * swap the `hits` Map below for Upstash Redis (`@upstash/ratelimit`) or
 * similar — the `check()` contract stays the same so call sites don't change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const hits = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, limit = 20, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const bucket = hits.get(key);

  if (!bucket || bucket.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

/** Derive a rate-limit key from a request, preferring a forwarded client IP. */
export function keyFromRequest(req: Request, scope: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return `${scope}:${ip}`;
}
