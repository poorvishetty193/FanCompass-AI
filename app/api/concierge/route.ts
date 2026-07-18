import { rateLimit } from '@/lib/rate-limit';
import { toErrorMessage } from '@/lib/errors';
import { ERROR_MESSAGES } from '@/lib/constants';
import { validateConciergePayload } from '@/features/chat/validators/conciergeValidator';
import { generateConciergeResponse } from '@/features/chat/services/conciergeService';
import type { ConciergeServicePayload } from '@/features/chat/services/conciergeService';

/**
 * POST handler for the AI Concierge API.
 * This is an ultra-thin controller handling only HTTP boundaries and rate limiting.
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

  try {
    const body = await req.json();
    
    // Validation Layer
    const validation = validateConciergePayload(body);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ error: validation.error }), { 
        status: validation.status || 400 
      });
    }

    // Service Layer
    const text = await generateConciergeResponse(body as ConciergeServicePayload);

    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Concierge Error:', toErrorMessage(error));
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.GENERIC_FAILURE }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
