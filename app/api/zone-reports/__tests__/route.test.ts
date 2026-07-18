import { POST } from '../route';
import { createZoneReport } from '@/lib/firebase/repositories';

jest.mock('@/lib/firebase/repositories', () => ({
  createZoneReport: jest.fn()
}));

jest.mock('@/lib/rate-limit', () => {
  let callCount = 0;
  return {
    rateLimit: jest.fn(() => {
      callCount++;
      if (callCount > 10) return { success: false, limit: 10, remaining: 0, reset: Date.now() + 60000 };
      return { success: true, limit: 10, remaining: 10 - callCount, reset: Date.now() + 60000 };
    })
  };
});

describe('POST /api/zone-reports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // reset rate limit mock count is tricky since it's inside the mock, let's just test 429 at the end
  });

  const createRequest = (body: Record<string, unknown>, headersObj: Record<string, string> = {}) => {
    return {
      json: async () => body,
      headers: {
        get: (key: string) => {
          const lowerKey = key.toLowerCase();
          const foundKey = Object.keys(headersObj).find(k => k.toLowerCase() === lowerKey);
          return foundKey ? headersObj[foundKey] : null;
        }
      }
    } as unknown as Request;
  };

  it('returns 401 if unauthenticated', async () => {
    const req = createRequest({ zoneId: 'north-gate', crowdLevel: 'low', message: 'All good' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 if missing fields', async () => {
    const req = createRequest({ zoneId: 'north-gate' }, { Authorization: 'Bearer test-token' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 on valid payload', async () => {
    (createZoneReport as jest.Mock).mockResolvedValue({ success: true, reportId: '123' });
    const req = createRequest(
      { zoneId: 'north-gate', crowdLevel: 'low', message: 'All good' },
      { Authorization: 'Bearer test-token' }
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('returns 429 on 11th request', async () => {
    // Make 7 more requests to hit 10 total (3 already made above)
    for (let i = 0; i < 7; i++) {
      await POST(createRequest({}));
    }
    // 11th request
    const req = createRequest({}, {});
    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });
});
