import { ERROR_MESSAGES, ZONES, CROWD_LEVELS } from '@/lib/constants';

export interface ReportValidationResult {
  isValid: boolean;
  error?: string;
  status?: number;
}

/**
 * Validates the payload for creating a new zone report.
 * @param {unknown} body - The parsed JSON payload
 * @returns {ReportValidationResult} Result of the validation
 */
export function validateReportPayload(body: unknown): ReportValidationResult {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_FIELDS, status: 400 };
  }

  const { zoneId, crowdLevel, message } = body as Record<string, unknown>;

  if (!zoneId || typeof zoneId !== 'string' || !Object.values(ZONES).includes(zoneId as never)) {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_FIELDS, status: 400 };
  }

  if (!crowdLevel || typeof crowdLevel !== 'string' || !Object.values(CROWD_LEVELS).includes(crowdLevel as never)) {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_FIELDS, status: 400 };
  }

  if (typeof message !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_FIELDS, status: 400 };
  }

  return { isValid: true };
}
