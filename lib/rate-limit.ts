import { RATE_LIMIT } from './constants';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory rate limiting implementation.
 * @param {string} ip The IP or identifier for the requester
 * @returns {RateLimitResult} The rate limit status
 */
export function rateLimit(ip: string = 'anonymous'): RateLimitResult {
  const now = Date.now();
  
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
      resetTime: now + RATE_LIMIT.WINDOW_MS
    };
    return {
      success: true,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: RATE_LIMIT.MAX_REQUESTS - 1,
      reset: store[ip].resetTime
    };
  }

  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    return {
      success: false,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: 0,
      reset: record.resetTime
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: RATE_LIMIT.MAX_REQUESTS,
    remaining: RATE_LIMIT.MAX_REQUESTS - record.count,
    reset: record.resetTime
  };
}
