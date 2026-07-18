import { ERROR_MESSAGES } from '@/lib/constants';

export interface ConciergeValidationResult {
  isValid: boolean;
  error?: string;
  status?: number;
}

/**
 * Validates the incoming payload for the concierge API route.
 * @param {unknown} body - The parsed JSON body from the request
 * @returns {ConciergeValidationResult} Result of the validation
 */
export function validateConciergePayload(body: unknown): ConciergeValidationResult {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_FIELDS, status: 400 };
  }

  const { messages } = body as Record<string, unknown>;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.MESSAGES_REQUIRED, status: 400 };
  }

  return { isValid: true };
}
