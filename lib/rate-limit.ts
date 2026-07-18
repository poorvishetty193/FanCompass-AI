import { RATE_LIMIT } from './constants';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/** Result returned by the rate limiter for each request. */
export interface RateLimitResult {
  /** Whether the request is allowed through. */
  success: boolean;
  /** Maximum requests allowed per window. */
  limit: number;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the current window resets. */
  reset: number;
}

/**
 * In-memory sliding-window rate limiter.
 * Probabilistically cleans up expired entries on ~10 % of calls.
 * @param {string} [ip='anonymous'] - IP address or unique client identifier
 * @returns {RateLimitResult} Object indicating whether the request is allowed
 */
export function rateLimit(ip: string = 'anonymous'): RateLimitResult {
  const now = Date.now();

  // Probabilistic cleanup of expired entries (~10 % of calls)
  if (Math.random() < 0.1) {
    for (const key in store) {
      if (store[key] && store[key].resetTime < now) {
        delete store[key];
      }
    }
  }

  const record = store[ip];

  if (!record || record.resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    };
    return {
      success: true,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: RATE_LIMIT.MAX_REQUESTS - 1,
      reset: store[ip].resetTime,
    };
  }

  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    return {
      success: false,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: RATE_LIMIT.MAX_REQUESTS,
    remaining: RATE_LIMIT.MAX_REQUESTS - record.count,
    reset: record.resetTime,
  };
}
