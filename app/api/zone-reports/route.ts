import { rateLimit } from '@/lib/rate-limit';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';
import { validateReportPayload } from '@/features/reports/validators/reportValidator';
import { ZoneReportService } from '@/features/reports/services/zoneReportService';
import type { ZoneReportInput } from '@/types';

/**
 * POST handler for creating a new zone report.
 * Ultra-thin controller that delegates all logic to the service and validator.
 * @param {Request} req - The incoming HTTP request
 * @returns {Promise<Response>} The HTTP response
 */
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
    
    // Validation Layer
    const validation = validateReportPayload(body);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ error: validation.error }), { 
        status: validation.status || 400 
      });
    }

    // Service Layer
    const result = await ZoneReportService.submitReport(body as ZoneReportInput);

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
