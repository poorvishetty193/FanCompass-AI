export function sanitizeInput(input: string, maxLength = 500): string {
  const trimmed = input.trim().replace(/<[^>]*>/g, '');
  if (trimmed.length > maxLength) {
    throw new RangeError(`Input exceeds maximum length of ${maxLength}`);
  }
  return trimmed;
}
