import { RATE_LIMIT } from './constants';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Using Map guarantees iteration in insertion order.
// Since windows are fixed length, the oldest entries are always at the start.
const store = new Map<string, RateLimitRecord>();

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
 * Utilizes O(1) expiration cleanup based on Map insertion order.
 * @param {string} [ip='anonymous'] - IP address or unique client identifier
 * @returns {RateLimitResult} Object indicating whether the request is allowed
 */
export function rateLimit(ip: string = 'anonymous'): RateLimitResult {
  const now = Date.now();

  // O(1) cleanup: delete oldest entries that have expired.
  // We only check the beginning of the Map since it's ordered by insertion.
  for (const [key, record] of store.entries()) {
    if (record.resetTime < now) {
      store.delete(key);
    } else {
      // Since entries are added in chronological order,
      // as soon as we hit an unexpired entry, all subsequent entries are also unexpired.
      break;
    }
  }

  const record = store.get(ip);

  if (!record || record.resetTime < now) {
    const newRecord = {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    };
    // If it already existed but expired, delete to move it to the end of insertion order
    if (record) store.delete(ip);
    store.set(ip, newRecord);

    return {
      success: true,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: RATE_LIMIT.MAX_REQUESTS - 1,
      reset: newRecord.resetTime,
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
