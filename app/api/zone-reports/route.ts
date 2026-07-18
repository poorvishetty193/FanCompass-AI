import { rateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitize';
import { createZoneReport } from '@/lib/firebase/repositories';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success, limit, remaining, reset } = rateLimit(ip);

  if (!success) {
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.RATE_LIMITED }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.AUTH_REQUIRED }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { zoneId, crowdLevel, incidentType, message } = body;
    
    if (!zoneId || !crowdLevel || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const sanitizedMessage = sanitizeInput(message, 500);
    const sanitizedIncidentType = incidentType ? sanitizeInput(incidentType, 100) : undefined;

    const result = await createZoneReport({
      zoneId,
      crowdLevel,
      incidentType: sanitizedIncidentType,
      message: sanitizedMessage
    });

    if (!result.success) {
      throw new Error(result.error || ERROR_MESSAGES.GENERIC_FAILURE);
    }

    return new Response(JSON.stringify({ success: true, reportId: result.reportId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Zone Report API Error:', toErrorMessage(error));
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.GENERIC_FAILURE }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
