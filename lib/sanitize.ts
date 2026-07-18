/**
 * Strips HTML tags, trims whitespace, and enforces a maximum length on user input.
 * Must be called on every user-provided string before Firestore writes or AI API calls.
 * @param {string} input - Raw user input to sanitize
 * @param {number} [maxLength=500] - Maximum allowed character count after trimming
 * @returns {string} Sanitized string with HTML tags removed and whitespace trimmed
 * @throws {RangeError} If the trimmed input exceeds maxLength characters
 */
export function sanitizeInput(input: string, maxLength = 500): string {
  const trimmed = input.trim().replace(/<[^>]*>/g, '');
  if (trimmed.length > maxLength) {
    throw new RangeError(`Input exceeds maximum length of ${maxLength}`);
  }
  return trimmed;
}
