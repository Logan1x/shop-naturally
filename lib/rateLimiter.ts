// Lightweight in-memory rate limiter for Next.js API routes
// Note: Works per serverless instance, resets on cold start (suitable for Vercel free tier)

type RateLimitEntry = {
  count: number;
  timestamp: number;
};

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 10; // Max 30 requests per window per IP

const ipStore = new Map<string, RateLimitEntry>();

/**
 * Check if an IP is within rate limit.
 * @param ip Client IP address
 * @returns { allowed: boolean, retryAfterSeconds: number }
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now - entry.timestamp > WINDOW_SIZE_MS) {
    // New window starts
    ipStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count < MAX_REQUESTS) {
    entry.count++;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  // Rate limit exceeded
  const retryAfterMs = WINDOW_SIZE_MS - (now - entry.timestamp);
  return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
}

/**
 * Optionally, expose a function to customize limits dynamically
 */
export function setRateLimitOptions(options: {
  windowMs?: number;
  maxRequests?: number;
}) {
  if (options.windowMs) {
    (globalThis as any).WINDOW_SIZE_MS = options.windowMs;
  }
  if (options.maxRequests) {
    (globalThis as any).MAX_REQUESTS = options.maxRequests;
  }
}
