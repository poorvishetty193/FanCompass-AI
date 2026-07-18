import { POST } from '../route';
import { getRecentZoneReports } from '@/lib/firebase/repositories';
import { generateText } from 'ai';

jest.mock('@/lib/firebase/repositories', () => ({
  getRecentZoneReports: jest.fn()
}));

jest.mock('ai', () => ({
  generateText: jest.fn()
}));

jest.mock('@ai-sdk/google', () => ({
  google: jest.fn()
}));

jest.mock('@/lib/rate-limit', () => {
  let count = 0;
  return {
    rateLimit: jest.fn(() => {
      count++;
      if (count > 10) return { success: false, limit: 10, remaining: 0, reset: Date.now() + 60000 };
      return { success: true, limit: 10, remaining: 10 - count, reset: Date.now() + 60000 };
    })
  };
});

describe('POST /api/concierge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: Record<string, unknown>) => {
    return {
      json: async () => body,
      headers: {
        get: (key: string) => null
      }
    } as unknown as Request;
  };

  it('returns 400 if messages are missing', async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 and fetches reports on valid payload', async () => {
    (getRecentZoneReports as jest.Mock).mockResolvedValue([{ zoneId: 'north-gate', crowdLevel: 'high' }]);
    (generateText as jest.Mock).mockResolvedValue({ text: 'AI response' });

    const req = createRequest({
      messages: [{ role: 'user', content: 'Hello' }],
      language: 'English',
      isAccessibilityMode: false
    });
    
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.content).toBe('AI response');
    expect(getRecentZoneReports).toHaveBeenCalled();
  });

  it('returns 429 on 11th request', async () => {
    // 8 more to hit 10
    for (let i = 0; i < 8; i++) {
      await POST(createRequest({}));
    }
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });
});
