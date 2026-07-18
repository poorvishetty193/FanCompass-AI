import { rateLimit } from '../rate-limit';
import { RATE_LIMIT } from '../constants';

describe('rateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-19T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow the first request', () => {
    const result = rateLimit('test-ip-1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 1);
  });

  it('should decrement remaining on subsequent requests', () => {
    rateLimit('test-ip-2');
    const result = rateLimit('test-ip-2');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 2);
  });

  it('should block requests over the maximum limit', () => {
    const ip = 'test-ip-3';
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
      rateLimit(ip);
    }
    const result = rateLimit(ip);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset window after WINDOW_MS expires', () => {
    const ip = 'test-ip-4';
    
    // Exhaust limit
    for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
      rateLimit(ip);
    }
    expect(rateLimit(ip).success).toBe(false);

    // Advance time past window
    jest.advanceTimersByTime(RATE_LIMIT.WINDOW_MS + 1000);

    // Should be allowed again
    const result = rateLimit(ip);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 1);
  });
});
